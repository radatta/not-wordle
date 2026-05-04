export type TileColor = "green" | "yellow" | "gray" | "empty";

export type GameStatus = "playing" | "won" | "lost";

export interface TileResult {
  letter: string;
  color: TileColor;
}

export interface NewGameResponse {
  session_id: string;
}

export interface GuessResponse {
  result: TileResult[];
  status: GameStatus;
  guesses_left: number;
}

export interface AnswerResponse {
  answer: string;
}

export interface SessionResponse {
  session_id: string;
  guesses: TileResult[][];
  status: GameStatus;
  guesses_left: number;
}
