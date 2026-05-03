"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import CzechMap from "@/components/CzechMap";
import QuestionModal from "@/components/QuestionModal";
import PlayerPanel from "@/components/PlayerPanel";
import GameEndModal from "@/components/GameEndModal";
import type { GameState, PendingAction, TurnResult } from "@/lib/types";

const POLL_INTERVAL_MS = 2000;

export default function GamePage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.gameId as string;

  const [game, setGame] = useState<GameState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [answerFeedback, setAnswerFeedback] = useState<{
    correct: boolean;
    captured: boolean;
    correctAnswer: string;
    territory: string;
  } | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMounted = useRef(true);

  // Load my player ID from localStorage
  useEffect(() => {
    const pid = localStorage.getItem(`quizdom_player_${gameId}`);
    setMyPlayerId(pid);
  }, [gameId]);

  // Poll game state
  const fetchGame = useCallback(async () => {
    try {
      const res = await fetch(`/api/game/${gameId}`, { cache: "no-store" });
      if (!res.ok) {
        if (res.status === 404) {
          setError("Hra nenalezena. Zkontroluj kód hry.");
          return;
        }
        return;
      }
      const data: GameState = await res.json();
      if (!isMounted.current) return;
      setGame(data);

      // Sync pending action from server for this player
      if (data.pendingAction && data.pendingAction.attackerId === myPlayerId) {
        setPendingAction(data.pendingAction);
      } else if (!data.pendingAction) {
        setPendingAction(null);
      }
    } catch {
      // silently retry
    }
  }, [gameId, myPlayerId]);

  useEffect(() => {
    isMounted.current = true;
    fetchGame();
    pollRef.current = setInterval(fetchGame, POLL_INTERVAL_MS);
    return () => {
      isMounted.current = false;
      if (pollRef.current) clearInterval(pollRef.current);
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, [fetchGame]);

  const handleStartGame = async () => {
    if (!myPlayerId) return;
    const res = await fetch(`/api/game/${gameId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", playerId: myPlayerId }),
    });
    const data = await res.json();
    if (data.error) setError(data.error);
    else fetchGame();
  };

  const handleTerritoryClick = async (territoryId: string) => {
    if (!myPlayerId || !game) return;
    if (game.status !== "playing") return;
    const currentPlayer = game.players[game.currentPlayerIndex];
    if (currentPlayer.id !== myPlayerId) return;

    setError("");
    const res = await fetch(`/api/game/${gameId}/attack`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: myPlayerId, territoryId }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      // Immediately fetch updated state (which includes pendingAction)
      await fetchGame();
    }
  };

  const handleAnswer = async (answer: string | number, responseTimeMs: number) => {
    if (!myPlayerId || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/game/${gameId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: myPlayerId, answer, responseTimeMs }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSubmitting(false);
        return;
      }

      // Show feedback
      const territory = game?.territories[pendingAction?.territoryId ?? ""];
      setAnswerFeedback({
        correct: data.correct,
        captured: data.captured,
        correctAnswer: data.correctAnswer,
        territory: territory?.name ?? "",
      });
      setPendingAction(null);

      // Auto-dismiss feedback after 2.5 seconds then refresh
      feedbackTimeoutRef.current = setTimeout(async () => {
        if (isMounted.current) {
          setAnswerFeedback(null);
          await fetchGame();
        }
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  // Derived state
  const myPlayer = game?.players.find((p) => p.id === myPlayerId) ?? null;
  const currentPlayer = game ? game.players[game.currentPlayerIndex] : null;
  const isMyTurn = currentPlayer?.id === myPlayerId;
  const winnerPlayer = game?.winner
    ? game.players.find((p) => p.id === game.winner) ?? null
    : null;
  const lastResult: TurnResult | null = game?.lastTurnResult ?? null;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (error && !game) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">❌ {error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold"
          >
            Zpět na hlavní menu
          </button>
        </div>
      </main>
    );
  }

  if (!game) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p>Načítání hry…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur px-4 py-3 flex items-center gap-4">
        <h1 className="text-lg font-extrabold text-white">🗺️ Quizdom</h1>
        <div className="flex-1 flex items-center gap-3 flex-wrap">
          {/* Game code */}
          <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded font-mono">
            #{gameId}
          </span>

          {/* Status */}
          {game.status === "waiting" && (
            <span className="text-yellow-400 text-sm font-semibold animate-pulse">
              ⏳ Čeká na hráče
            </span>
          )}
          {game.status === "playing" && currentPlayer && (
            <span className="text-sm text-gray-300">
              Na tahu:{" "}
              <strong className="text-white">{currentPlayer.name}</strong>
              {isMyTurn && (
                <span className="ml-1 text-yellow-400 font-bold animate-pulse">
                  {" "}← ty!
                </span>
              )}
            </span>
          )}
          {game.status === "finished" && (
            <span className="text-green-400 text-sm font-bold">✅ Hra skončila</span>
          )}
        </div>

        {/* My player info */}
        {myPlayer && (
          <div className="text-xs text-gray-400 shrink-0">
            Hraji jako{" "}
            <strong className="text-white">{myPlayer.name}</strong> ·{" "}
            {myPlayer.turnsRemaining} tahů
          </div>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* Map area */}
        <div className="flex-1 flex flex-col p-4 gap-3">
          {/* Lobby panel */}
          {game.status === "waiting" && (
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-5 text-center">
              <h2 className="text-xl font-bold text-white mb-2">Lobby</h2>
              <p className="text-gray-400 text-sm mb-4">
                Sdílej tento kód se svými přáteli:
              </p>
              <div className="inline-block bg-gray-900 border border-gray-600 rounded-xl px-6 py-3 mb-4">
                <span className="text-3xl font-extrabold text-white font-mono tracking-widest">
                  {gameId}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-4">
                {game.players.length} / {game.maxPlayers} hráčů připojeno
              </p>
              {myPlayer?.isHost && (
                <button
                  onClick={handleStartGame}
                  disabled={game.players.length < 1}
                  className="px-8 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-500 disabled:opacity-50 transition-colors"
                >
                  🚀 Spustit hru ({game.players.length} hráč
                  {game.players.length === 1 ? "" : "e/ů"})
                </button>
              )}
              {!myPlayer?.isHost && (
                <p className="text-gray-400 text-sm">
                  Čekáme, až hostitel spustí hru…
                </p>
              )}
            </div>
          )}

          {/* Turn instruction */}
          {game.status === "playing" && isMyTurn && !pendingAction && !answerFeedback && (
            <div className="bg-blue-900/30 border border-blue-700 rounded-xl px-4 py-3 text-sm text-blue-300 text-center">
              👆 Klikni na území na mapě, které chceš obsadit nebo dobýt
            </div>
          )}

          {game.status === "playing" && !isMyTurn && !pendingAction && !answerFeedback && currentPlayer && (
            <div className="bg-gray-800/40 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-400 text-center">
              Čekáme na tah hráče <strong className="text-white">{currentPlayer.name}</strong>…
            </div>
          )}

          {/* Last turn result notification */}
          {lastResult && !answerFeedback && !pendingAction && (
            <div
              className={[
                "rounded-xl px-4 py-3 text-sm text-center border",
                lastResult.correct
                  ? "bg-green-900/30 border-green-700 text-green-300"
                  : "bg-red-900/30 border-red-700 text-red-300",
              ].join(" ")}
            >
              {lastResult.correct ? "✅" : "❌"}{" "}
              <strong>{lastResult.playerName}</strong>{" "}
              {lastResult.captured
                ? `obsadil/a ${lastResult.territoryName}`
                : lastResult.correct
                ? `správně odpověděl/a na otázku`
                : `neodpověděl/a správně`}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
              ⚠️ {error}
            </div>
          )}

          {/* Czech Map */}
          <div className="flex-1 flex items-center justify-center">
            <CzechMap
              territories={game.territories}
              players={game.players}
              currentPlayerId={myPlayerId}
              onTerritoryClick={handleTerritoryClick}
              disabled={!isMyTurn || game.status !== "playing" || !!pendingAction}
              pendingTerritoryId={pendingAction?.territoryId}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-64 xl:w-72 border-t lg:border-t-0 lg:border-l border-gray-800 bg-gray-900/50 p-4 overflow-y-auto">
          <PlayerPanel
            players={game.players}
            currentPlayerId={currentPlayer?.id ?? null}
            myPlayerId={myPlayerId}
            roundsPerPlayer={game.roundsPerPlayer}
          />

          {/* Game info */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Kol na hráče</span>
              <span className="text-gray-300">{game.roundsPerPlayer}</span>
            </div>
            <div className="flex justify-between">
              <span>Území obsazeno</span>
              <span className="text-gray-300">
                {Object.values(game.territories).filter((t) => t.ownerId).length} / 14
              </span>
            </div>
            <div className="flex justify-between">
              <span>Hráčů</span>
              <span className="text-gray-300">{game.players.length}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-4 w-full py-2 rounded-lg text-gray-400 hover:text-white text-xs border border-gray-800 hover:border-gray-600 transition-colors"
          >
            ← Hlavní menu
          </button>
        </aside>
      </div>

      {/* Question modal */}
      {pendingAction && isMyTurn && !answerFeedback && (
        <QuestionModal
          question={pendingAction.question}
          territoryName={
            game.territories[pendingAction.territoryId]?.name ?? pendingAction.territoryId
          }
          isAttack={pendingAction.isAttack}
          onAnswer={handleAnswer}
          disabled={submitting}
        />
      )}

      {/* Answer feedback overlay */}
      {answerFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            className={[
              "rounded-2xl p-8 text-center max-w-sm w-full border shadow-2xl",
              answerFeedback.correct
                ? "bg-green-900 border-green-600"
                : "bg-red-900 border-red-600",
            ].join(" ")}
          >
            <div className="text-5xl mb-3">
              {answerFeedback.correct ? "✅" : "❌"}
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">
              {answerFeedback.correct ? "Správně!" : "Špatně!"}
            </h2>
            {answerFeedback.captured ? (
              <p className="text-green-200 text-base">
                Obsadil/a jsi <strong>{answerFeedback.territory}</strong>!
              </p>
            ) : (
              <p className="text-gray-300 text-sm">
                Správná odpověď: <strong>{answerFeedback.correctAnswer}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Game end modal */}
      {game.status === "finished" && !answerFeedback && (
        <GameEndModal
          winner={winnerPlayer}
          players={game.players}
          onPlayAgain={() => router.push("/")}
        />
      )}
    </main>
  );
}
