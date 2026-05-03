"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");
  const [rounds, setRounds] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"home" | "create" | "join">("home");

  const handleGoBack = useCallback(() => {
    setMode("home");
    setError("");
  }, []);

  const handleCreate = async () => {
    if (!playerName.trim()) {
      setError("Zadej své jméno.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: playerName.trim(), roundsPerPlayer: rounds }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem(`quizdom_player_${data.gameId}`, data.playerId);
        router.push(`/game/${data.gameId}`);
      }
    } catch {
      setError("Nelze se připojit k serveru.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!playerName.trim()) {
      setError("Zadej své jméno.");
      return;
    }
    if (!gameCode.trim()) {
      setError("Zadej kód hry.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/game/${gameCode.trim().toUpperCase()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", playerName: playerName.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem(
          `quizdom_player_${gameCode.trim().toUpperCase()}`,
          data.playerId
        );
        router.push(`/game/${gameCode.trim().toUpperCase()}`);
      }
    } catch {
      setError("Nelze se připojit k serveru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 px-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">
          🗺️ Quizdom
        </h1>
        <p className="text-gray-400 text-lg">Dobyvatelská kvízová hra o Česku</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        {mode === "home" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setMode("create")}
              className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors text-base"
            >
              🎮 Vytvořit novou hru
            </button>
            <button
              onClick={() => setMode("join")}
              className="w-full py-4 rounded-xl font-bold text-white bg-gray-700 hover:bg-gray-600 active:bg-gray-800 transition-colors text-base"
            >
              🔑 Připojit se ke hře
            </button>
          </div>
        )}

        {mode === "create" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoBack}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              ← Zpět
            </button>
            <h2 className="text-xl font-bold text-white">Nová hra</h2>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Tvoje jméno</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Např. Jarda"
                maxLength={20}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">
                Kol na hráče: <strong className="text-white">{rounds}</strong>
              </label>
              <input
                type="range"
                min={3}
                max={20}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3</span>
                <span>20</span>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Vytváření…" : "Vytvořit hru"}
            </button>
          </div>
        )}

        {mode === "join" && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleGoBack}
              className="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
            >
              ← Zpět
            </button>
            <h2 className="text-xl font-bold text-white">Připojit se</h2>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Tvoje jméno</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Např. Jarda"
                maxLength={20}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-1">Kód hry</label>
              <input
                type="text"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                placeholder="Např. AB3D7E"
                maxLength={6}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 font-mono uppercase tracking-widest"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Připojování…" : "Připojit se"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-gray-600 text-xs text-center max-w-xs">
        Multiplayer tahová hra · Obsaď všechny kraje ČR · Odpovídej správně na otázky
      </p>
    </main>
  );
}
