import { Fight, FightPrediction } from "./fight";

export interface ApiResponse<T = any> {
  error: boolean;
  message?: string;
  data?: T;
}

export interface ScrapeRequest {
  key: string;
}

export interface FileData {
  data: Event[];
  updatedAt: Date;
}

export interface AIPredictionRequest {
  fights: Fight[];
}

export interface AIPredictionResponse {
  predictions: FightPrediction[];
}
