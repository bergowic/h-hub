export interface Organisation {
    id: string,
    name: string,
    shortName: string,
    seasonIds: Set<string>,
    leagueIds: Set<string>,
}
