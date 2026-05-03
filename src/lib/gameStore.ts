import type { GameState, Player, PlayerColor } from "./types";
import { PLAYER_COLORS } from "./types";
import { getInitialTerritories } from "./territories";
import { getRandomQuestion, getAttackQuestion, evaluateAnswer } from "./questions";

import { randomInt } from "crypto";

// ---------------------------------------------------------------------------
// In-memory singleton store – persists across hot-reloads in Next.js dev mode
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line no-var
  var __gameStore: Map<string, GameState> | undefined;
}

const store: Map<string, GameState> =
  global.__gameStore ?? (global.__gameStore = new Map());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateId(length: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < length; i++) {
    id += chars[randomInt(chars.length)];
  }
  return id;
}

function nextActivePlayer(game: GameState): number {
  const total = game.players.length;
  let idx = (game.currentPlayerIndex + 1) % total;
  let checked = 0;
  while (game.players[idx].turnsRemaining === 0 && checked < total) {
    idx = (idx + 1) % total;
    checked++;
  }
  return idx;
}

function isGameOver(game: GameState): boolean {
  return game.players.every((p) => p.turnsRemaining === 0);
}

function computeWinner(game: GameState): string {
  let best: Player | null = null;
  for (const p of game.players) {
    if (!best || p.territoriesOwned > best.territoriesOwned) {
      best = p;
    } else if (p.territoriesOwned === best.territoriesOwned && p.score > best.score) {
      best = p;
    }
  }
  return best?.id ?? game.players[0]?.id ?? "";
}

function recomputeTerritories(game: GameState): void {
  const counts: Record<string, number> = {};
  for (const t of Object.values(game.territories)) {
    if (t.ownerId) {
      counts[t.ownerId] = (counts[t.ownerId] ?? 0) + 1;
    }
  }
  for (const p of game.players) {
    p.territoriesOwned = counts[p.id] ?? 0;
    p.score = p.territoriesOwned;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function createGame(
  playerName: string,
  roundsPerPlayer = 10,
  maxPlayers = 6
): { gameId: string; playerId: string } {
  const gameId = generateId(6);
  const playerId = generateId(10);

  const player: Player = {
    id: playerId,
    name: playerName,
    color: PLAYER_COLORS[0],
    turnsRemaining: roundsPerPlayer,
    score: 0,
    territoriesOwned: 0,
    isHost: true,
  };

  const game: GameState = {
    id: gameId,
    status: "waiting",
    players: [player],
    territories: getInitialTerritories(),
    currentPlayerIndex: 0,
    roundsPerPlayer,
    pendingAction: null,
    winner: null,
    lastTurnResult: null,
    createdAt: Date.now(),
    lastActivity: Date.now(),
    maxPlayers,
  };

  store.set(gameId, game);
  return { gameId, playerId };
}

export function joinGame(
  gameId: string,
  playerName: string
): { playerId: string } | { error: string } {
  const game = store.get(gameId);
  if (!game) return { error: "Hra nenalezena." };
  if (game.status !== "waiting") return { error: "Hra již probíhá nebo skončila." };
  if (game.players.length >= game.maxPlayers) return { error: "Hra je plná." };
  if (game.players.some((p) => p.name === playerName))
    return { error: "Jméno hráče je již obsazeno." };

  const playerId = generateId(10);
  const color = PLAYER_COLORS[game.players.length] as PlayerColor;

  game.players.push({
    id: playerId,
    name: playerName,
    color,
    turnsRemaining: game.roundsPerPlayer,
    score: 0,
    territoriesOwned: 0,
    isHost: false,
  });

  game.lastActivity = Date.now();
  return { playerId };
}

export function startGame(
  gameId: string,
  playerId: string
): { success: boolean; error?: string } {
  const game = store.get(gameId);
  if (!game) return { success: false, error: "Hra nenalezena." };
  if (game.status !== "waiting") return { success: false, error: "Hra již běží." };

  const player = game.players.find((p) => p.id === playerId);
  if (!player?.isHost) return { success: false, error: "Pouze hostitel může spustit hru." };
  if (game.players.length < 1) return { success: false, error: "Nejsou žádní hráči." };

  game.status = "playing";
  game.currentPlayerIndex = 0;
  game.lastActivity = Date.now();
  return { success: true };
}

export function getGame(gameId: string): GameState | null {
  return store.get(gameId) ?? null;
}

export function attackTerritory(
  gameId: string,
  playerId: string,
  territoryId: string
): { success: boolean; error?: string; question?: GameState["pendingAction"] } {
  const game = store.get(gameId);
  if (!game) return { success: false, error: "Hra nenalezena." };
  if (game.status !== "playing") return { success: false, error: "Hra neběží." };

  const currentPlayer = game.players[game.currentPlayerIndex];
  if (currentPlayer.id !== playerId)
    return { success: false, error: "Nejsi na tahu." };
  if (currentPlayer.turnsRemaining <= 0)
    return { success: false, error: "Nemáš žádné tahy." };

  const territory = game.territories[territoryId];
  if (!territory) return { success: false, error: "Území nenalezeno." };
  if (territory.ownerId === playerId)
    return { success: false, error: "Toto území již vlastníš." };
  if (game.pendingAction)
    return { success: false, error: "Čeká se na odpověď na otázku." };

  const isAttack = territory.ownerId !== null;
  const question = isAttack ? getAttackQuestion() : getRandomQuestion(true);

  game.pendingAction = {
    territoryId,
    question,
    attackerId: playerId,
    isAttack,
    startTime: Date.now(),
  };
  game.lastActivity = Date.now();

  return { success: true };
}

export function answerQuestion(
  gameId: string,
  playerId: string,
  answer: string | number,
  responseTimeMs: number
): {
  success: boolean;
  correct?: boolean;
  captured?: boolean;
  error?: string;
  correctAnswer?: string;
} {
  const game = store.get(gameId);
  if (!game) return { success: false, error: "Hra nenalezena." };
  if (!game.pendingAction) return { success: false, error: "Žádná čekající otázka." };
  if (game.pendingAction.attackerId !== playerId)
    return { success: false, error: "Nejsi útočník." };

  const { territoryId, question, isAttack } = game.pendingAction;
  const correct = evaluateAnswer(question, answer);
  const territory = game.territories[territoryId];
  const currentPlayer = game.players[game.currentPlayerIndex];

  let captured = false;
  if (correct) {
    territory.ownerId = playerId;
    captured = true;
  }

  // Build a human-readable correct answer string
  let correctAnswer: string;
  if (question.type === "abcd") {
    correctAnswer = question.options[question.correctIndex];
  } else {
    correctAnswer = `${question.correctValue} ${question.unit}`;
  }

  // Store last turn result for all clients to read
  game.lastTurnResult = {
    playerId,
    playerName: currentPlayer.name,
    territoryId,
    territoryName: territory.name,
    correct,
    captured,
    questionText: question.text,
  };

  // Decrement turn
  currentPlayer.turnsRemaining--;

  // Recompute territory ownership counts
  recomputeTerritories(game);

  // Clear pending action
  game.pendingAction = null;

  // Check game over
  if (isGameOver(game)) {
    game.status = "finished";
    game.winner = computeWinner(game);
  } else {
    // Advance to next player with remaining turns
    game.currentPlayerIndex = nextActivePlayer(game);
  }

  game.lastActivity = Date.now();
  return { success: true, correct, captured, correctAnswer };
}

// Clean up stale games (> 2 hours old) – called lazily
export function purgeStaleGames(): void {
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const now = Date.now();
  const toDelete: string[] = [];
  store.forEach((game, id) => {
    if (now - game.lastActivity > TWO_HOURS) {
      toDelete.push(id);
    }
  });
  toDelete.forEach((id) => store.delete(id));
}
