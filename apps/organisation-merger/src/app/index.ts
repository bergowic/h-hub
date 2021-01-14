import { RawOrgProps } from "@h-hub/common"
import { Organisation } from "@h-hub/models"

type MapCounter = Map<string, number>

function toArray<T>(values: Set<T> | T[]): T[] {
    if (values === undefined) {
        return []
    }

    if (values instanceof Set) {
        return [...values.values()]
    }

    return values
}

function getIdCount(countIds: MapCounter, id: string) {
    if (countIds.has(id)) {
        return countIds.get(id)
    }

    return 0
}

function addId(countIds: MapCounter, id: string): void {
    countIds.set(id, getIdCount(countIds, id) + 1)
}

function addIds(countIds: MapCounter, ids?: Set<string>): void {
    if (ids) {
        ids.forEach(id => addId(countIds, id))
    }
}

function getSubOrgIdsCount(organisations: Organisation[]): MapCounter {
    const subOrgIdsCount: MapCounter = new Map()

    organisations.forEach(organisation => addIds(subOrgIdsCount, organisation.subOrgIds))

    return subOrgIdsCount 
}

function getFilteredSubOrgIds(organisations: Organisation[], filter: (count: number) => boolean): Set<string> {
    return new Set([...getSubOrgIdsCount(organisations).entries()]
        .filter(([_, count]) => filter(count))
        .map(([orgId, _]) => orgId)
    )
}

function getParentOrgCount(subOrgIds: Set<string>, parentOrgIds: Set<string>): number {
    return toArray(subOrgIds)
        .filter(orgId => parentOrgIds.has(orgId))
        .length
}

function assertOneParentMax(organisation: Organisation, parentOrgIds: Set<string>): void {
    if (getParentOrgCount(organisation.subOrgIds, parentOrgIds) > 1) {
        throw new Error(`Organisation '${organisation.id}' has more than one parent organisation`)
    }
}

function getRawOrgProps(ids: Set<string> | string[], orgId?: string): RawOrgProps[]  {
    return toArray(ids).map(id => {
        return { id, orgId }
    })
}

function isParentOrg(count: number): boolean {
    return count > 1
}

function isSubOrg(count: number): boolean {
    return count === 1
}

export const getParentOrgs = (orgs: Organisation[]): RawOrgProps[] => {
    const parentOrgIds = getFilteredSubOrgIds(orgs, isParentOrg)

    orgs.forEach(org => assertOneParentMax(org, parentOrgIds))

    return getRawOrgProps(parentOrgIds)
}

export const getBaseOrganisations = (orgs: Organisation[]): Organisation[] => {
    return []
}

export const getSubOrgs = (orgs: Organisation[]): RawOrgProps[] => {
    const subOrgIds = getFilteredSubOrgIds(orgs, isSubOrg)

    return orgs.flatMap(organisation => 
        getRawOrgProps(toArray(organisation.subOrgIds)
            .filter(subOrgId => subOrgIds.has(subOrgId))
        , organisation.id)
    )
}
