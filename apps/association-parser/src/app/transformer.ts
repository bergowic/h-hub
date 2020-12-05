import { toNumber } from 'lodash'

import { Association, RawAssociation, Org, RawOrganisation, Organisation, Period } from "@h-hub/models";

function isIdLower(baseId: string, compareId: string): boolean {
    return toNumber(baseId) < toNumber(compareId)
}

function getSubOrganisationIds(org: Org): Set<string> {
    const allIds = Object.keys(org.list)
    const cleanIds = allIds.filter((id) => isIdLower(org.selectedID, id))

    return new Set(cleanIds)
}

function getSeasonIds(period: Period): Set<string> {
    const ids = Object.keys(period.list)

    return new Set(ids)
}

export function transformRawOrganisation(rawOrganisation: RawOrganisation | RawAssociation): Organisation {
    return {
        name: rawOrganisation.head.name,
        shortName: rawOrganisation.head.sname,
        seasonIds: getSeasonIds(rawOrganisation.menu.period),
    }    
}

export function transformRawAssociation(rawAssociation: RawAssociation): Association {
    return {
        ...transformRawOrganisation(rawAssociation),
        subOrganisationIds: getSubOrganisationIds(rawAssociation.menu.org),
    }    
}
