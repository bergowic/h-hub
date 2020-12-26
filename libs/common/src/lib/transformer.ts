import { toNumber } from 'lodash'

import { Org, RawOrganisation, Organisation, Period, Class, JsonOrganisation } from "@h-hub/models";

function isIdLower(baseId: string, compareId: string): boolean {
    return toNumber(baseId) < toNumber(compareId)
}

function getSubOrganisationIds(org: Org): Set<string> {
    const ids = Object.keys(org.list)

    return new Set(ids)
}

function getSeasonIds(period: Period): Set<string> {
    const ids = Object.keys(period.list)

    return new Set(ids)
}

function getLeagueIds(classes: Class[]): Set<string> {
    const ids = classes.map(c => c.gClassID)

    return new Set(ids)
}

export function transformRawOrganisation(rawOrganisation: RawOrganisation): Organisation {
    return {
        id: rawOrganisation.menu.org.selectedID,
        name: rawOrganisation.head.name,
        shortName: rawOrganisation.head.sname,
        seasonIds: getSeasonIds(rawOrganisation.menu.period),
        leagueIds: getLeagueIds(rawOrganisation.content.classes),
        subOrgIds: getSubOrganisationIds(rawOrganisation.menu.org),
    }    
}

export function organisationToJson(organisation: Organisation): JsonOrganisation {
    return {
        ...organisation,
        seasonIds: [...organisation.seasonIds],
        leagueIds: [...organisation.leagueIds],
        subOrgIds: organisation.subOrgIds ? [...organisation.subOrgIds] : undefined,
    }
}
