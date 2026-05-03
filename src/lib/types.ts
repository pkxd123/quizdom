export type PlayerColor = "red" | "blue" | "green" | "yellow" | "purple" | "orange";

export const PLAYER_COLORS: PlayerColor[] = ["red", "blue", "green", "yellow", "purple", "orange"];

export const COLOR_HEX: Record<PlayerColor, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  orange: "#f97316",
};

export const COLOR_HEX_LIGHT: Record<PlayerColor, string> = {
  red: "#fca5a5",
  blue: "#93c5fd",
  green: "#86efac",
  yellow: "#fde047",
  purple: "#d8b4fe",
  orange: "#fdba74",
};

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  turnsRemaining: number;
  score: number;
  territoriesOwned: number;
  correctAnswers: number; // tiebreaker: total correct answers given
  isHost: boolean;
}

export interface Territory {
  id: string;
  name: string;
  ownerId: string | null;
}

export type QuestionType = "abcd" | "numerical";

export interface ABCDQuestion {
  id: string;
  type: "abcd";
  text: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  difficulty: "easy" | "medium" | "hard";
}

export interface NumericalQuestion {
  id: string;
  type: "numerical";
  text: string;
  unit: string;
  correctValue: number;
  tolerance: number; // ± tolerance: answer within [correctValue - tolerance, correctValue + tolerance] is accepted
  difficulty: "easy" | "medium" | "hard";
}

export type Question = ABCDQuestion | NumericalQuestion;

export type GameStatus = "waiting" | "playing" | "finished";

export interface PendingAction {
  territoryId: string;
  question: Question;
  attackerId: string;
  isAttack: boolean; // true = attacking occupied territory
  startTime: number;
}

export interface TurnResult {
  playerId: string;
  playerName: string;
  territoryId: string;
  territoryName: string;
  correct: boolean;
  captured: boolean;
  questionText: string;
}

export interface GameState {
  id: string;
  status: GameStatus;
  players: Player[];
  territories: Record<string, Territory>;
  currentPlayerIndex: number;
  roundsPerPlayer: number;
  pendingAction: PendingAction | null;
  winner: string | null;
  lastTurnResult: TurnResult | null;
  createdAt: number;
  lastActivity: number;
  maxPlayers: number;
}

export interface CreateGameRequest {
  playerName: string;
  roundsPerPlayer?: number;
  maxPlayers?: number;
}

export interface JoinGameRequest {
  playerName: string;
}

export interface AttackRequest {
  playerId: string;
  territoryId: string;
}

export interface AnswerRequest {
  playerId: string;
  answer: string | number;
  responseTimeMs: number;
}
