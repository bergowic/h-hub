export interface Organisation {
    id: string,
    orgId?: string,
    name: string,
    shortName: string,
    seasonIds: Set<string>,
    leagueIds: Set<string>,
    subOrgIds?: Set<string>,
}

export interface JsonOrganisation {
    id: string,
    orgId?: string,
    name: string,
    shortName: string,
    seasonIds: string[],
    leagueIds: string[],
    subOrgIds?: string[],
}
