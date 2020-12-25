import { toNumber } from 'lodash'

import { Association, RawAssociation, Org, RawOrganisation, Organisation, Period, Class, JsonOrganisation, JsonAssociation } from "@h-hub/models";

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

function getLeagueIds(classes: Class[]): Set<string> {
    const ids = classes.map(c => c.gClassID)

    return new Set(ids)
}

export function transformRawOrganisation(rawOrganisation: RawOrganisation | RawAssociation): Organisation {
    return {
        id: rawOrganisation.menu.org.selectedID,
        name: rawOrganisation.head.name,
        shortName: rawOrganisation.head.sname,
        seasonIds: getSeasonIds(rawOrganisation.menu.period),
        leagueIds: getLeagueIds(rawOrganisation.content.classes),
    }    
}

export function transformRawAssociation(rawAssociation: RawAssociation): Association {
    return {
        ...transformRawOrganisation(rawAssociation),
        subOrganisationIds: getSubOrganisationIds(rawAssociation.menu.org),
    }    
}

export function organisationToJson(organisation: Organisation): JsonOrganisation {
    return {
        ...organisation,
        seasonIds: [...organisation.seasonIds],
        leagueIds: [...organisation.leagueIds],
    }
}

export function associationToJson(association: Association): JsonAssociation {
    return {
        ...organisationToJson(association),
        subOrganisationIds: [...association.subOrganisationIds],
    }
}
