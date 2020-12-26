export interface Org {
    list: {[key: string]: string},
    selectedID: string,
}

export interface Period {
    list: {[key: string]: string},
    selectedID: string,
}

export interface Dt {
    list: {[key: string]: string},
    selected: string,
}

export interface Menu {
    org: Org,
    period: Period,
    dt: Dt,
}

export interface Head {
    name: string,
    sname: string,
    headline1: string,
    headline2: string,
    actualized: string,
    live: number,
    repURL: string,
}

export interface Class {
    gClassID: string,
    gClassSname: string,
    gClassLname: string,
    gClassGender: string,
    gClassAGsDesc: string,
    gClassAGsYear: string,
    gRefAllocType: string,
    gRefRespOrg: string,
    games: any[],
}

export interface OrganisationContent {
    classes: Class[],
}

export interface Game {
    gID: string,
    sGID: any,
    gNo: string,
    live: boolean,
    gToken: string,
    gAppid: string,
    gDate: string,
    gWDay: string,
    gTime: string,
    gGymnasiumID: string,
    gGymnasiumNo: string,
    gGymnasiumName: string,
    gGymnasiumPostal: string,
    gGymnasiumTown: string,
    gGymnasiumStreet: string,
    gHomeTeam: string,
    gGuestTeam: string,
    gHomeGoals: string,
    gGuestGoals: string,
    gHomeGoals_1: string,
    gGuestGoals_1: string,
    gHomePoints: string,
    gGuestPoints: string,
    gComment: string,
    gGroupsortTxt: string,
    gReferee: string,
}

export interface GamesContainer {
    gClassID: string,
    gClassSname: string,
    gClassLname: string,
    gClassGender?: any,
    gClassAGsDesc?: any,
    gClassAGsYear?: any,
    gRefAllocType: string,
    gRefRespOrg: string,
    games: Game[],
}

// If string it will be always empty: ""
export type TabScore = number | string

export interface Score {
    tabScore: TabScore,
    tabTeamID: string,
    tabTeamname: string,
    liveTeam: boolean,
    numPlayedGames: number,
    numWonGames: number,
    numEqualGames: number,
    numLostGames: number,
    numGoalsShot: number,
    numGoalsGot: number,
    pointsPlus: number,
    pointsMinus: number,
    pointsPerGame10: string,
    numGoalsDiffperGame: string,
    numGoalsShotperGame: string,
    posCriterion: string,
}

// If object it has no keys: {}
export type Games = GamesContainer | []

export interface RawOrganisation {
    menu: Menu,
    head: Head,
    content: OrganisationContent,
}
