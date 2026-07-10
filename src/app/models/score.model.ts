export interface Score {
  [key: string]: number;
}

export interface ScoreRow {
  [key: string]: string | number;
}

export interface TeamScore {
  key: string;
  name: string;
  color: string;
  points: number;
}

export interface TeamDefinition {
  key: string;
  name: string;
  color: string;
}

export interface ScoreboardData {
  scores: ScoreRow[];
  teams: TeamDefinition[];
}