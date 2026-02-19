export interface GenerateResponse {
  words: string[];
  targetIndices: number[];
}

export interface Score {
  id: number;
  player_name: string;
  score: number;
  level_reached: number;
  created_at: string;
}

export type GamePhase = 'start' | 'flashing' | 'answering' | 'result' | 'gameover';

export interface LevelConfig {
  wordCount: number;
  targetWords: number;
  flashSpeed: number;
}

export interface GameState {
  phase: GamePhase;
  playerName: string;
  level: number;
  score: number;
  lives: number;
  words: string[];
  targetIndices: number[];
  selectedAnswers: number[];
  roundCorrect: boolean | null;
}
