import { RawOrgProps } from "@h-hub/common"
import { Organisation } from "@h-hub/models"
import { omit } from "lodash"

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

function addSubOrgIds(countIds: MapCounter, organisation: Organisation): void {
    toArray(organisation.subOrgIds)
        .filter(id => id !== organisation.id)
        .forEach(id => addId(countIds, id))
}

function getSubOrgIdsCount(organisations: Organisation[]): MapCounter {
    const subOrgIdsCount: MapCounter = new Map()

    organisations.forEach(organisation => addSubOrgIds(subOrgIdsCount, organisation))

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

function getParentOrgIds(orgs: Organisation[]): Set<string> {
    const parentOrgIds = getFilteredSubOrgIds(orgs, isParentOrg)

    orgs.forEach(org => assertOneParentMax(org, parentOrgIds))

    return parentOrgIds
}

function getSubOrgIds(orgs: Organisation[]): Set<string> {
    return getFilteredSubOrgIds(orgs, isSubOrg)
}

export const getParentOrgs = (orgs: Organisation[]): RawOrgProps[] => {
    const parentOrgIds = getParentOrgIds(orgs)

    return getRawOrgProps(parentOrgIds)
}

function isBaseOrganisation(id: string, allParentOrgIds: Set<string>, allSubOrgIds: Set<string>): boolean {
    return !allParentOrgIds.has(id) && !allSubOrgIds.has(id)
}

function getBaseOrganisationOrgId(origSubOrgIds: Set<string>, allParentOrgIds: Set<string>): string | undefined {
    return toArray(origSubOrgIds).find(id => allParentOrgIds.has(id))
}

function getBaseOrganisationSubOrgIds(origSubOrgIds: Set<string>, allSubOrgIds: Set<string>): Set<string> | undefined {
    const subOrgIds = toArray(origSubOrgIds).filter(id => allSubOrgIds.has(id))

    if (subOrgIds.length > 0) {
        return new Set(subOrgIds)
    }

    return undefined
}

function getBaseOrganisation(org: Organisation, allParentOrgIds: Set<string>, allSubOrgIds: Set<string>): Organisation {
    const orgId = getBaseOrganisationOrgId(org.subOrgIds, allParentOrgIds)
    const subOrgIds = getBaseOrganisationSubOrgIds(org.subOrgIds, allSubOrgIds)

    const organisation: Organisation = omit({ ...org }, 'orgId', 'subOrgIds')
    if (orgId) {
        organisation.orgId = orgId
    }
    if (subOrgIds) {
        organisation.subOrgIds = subOrgIds
    }

    return organisation
}

export const getBaseOrganisations = (orgs: Organisation[]): Organisation[] => {
    const allParentOrgIds = getParentOrgIds(orgs)
    const allSubOrgIds = getSubOrgIds(orgs)

    return orgs.filter(({ id }) => isBaseOrganisation(id, allParentOrgIds, allSubOrgIds))
        .map(org => getBaseOrganisation(org, allParentOrgIds, allSubOrgIds))
}

export const getSubOrgs = (orgs: Organisation[]): RawOrgProps[] => {
    const subOrgIds = getSubOrgIds(orgs)

    return orgs.flatMap(organisation => 
        getRawOrgProps(toArray(organisation.subOrgIds)
            .filter(subOrgId => subOrgIds.has(subOrgId))
        , organisation.id)
    )
}
