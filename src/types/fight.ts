export interface Fighter {
  name: string;
  record: string;
  country: string;
  picture: string;
  link: string;
}

export interface Fight {
  main: boolean;
  weight: string;
  fighterA: Fighter;
  fighterB: Fighter;
  prediction?: FightPrediction;
}

export interface FightPrediction {
  winner: string;
  confidence: number;
  analysis: string;
  keyFactors: string[];
}
