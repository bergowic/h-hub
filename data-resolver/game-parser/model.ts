export type Player = {
  name: string
  goals: number
  goals7m: number
  attempts7m: number
  yellowCard: boolean
  redCard: boolean
  timePenalties: number
}

export type Team = {
  name: string
  players: Player[]
}

export type Game = {
  home: Team
  guest: Team
}
