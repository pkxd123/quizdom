"use client";

import type { Player } from "@/lib/types";
import { COLOR_HEX } from "@/lib/types";

interface GameEndModalProps {
  winner: Player | null;
  players: Player[];
  onPlayAgain: () => void;
}

export default function GameEndModal({ winner, players, onPlayAgain }: GameEndModalProps) {
  const sorted = [...players].sort(
    (a, b) => b.territoriesOwned - a.territoriesOwned || b.score - a.score
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        {/* Trophy */}
        <div className="text-6xl mb-3">🏆</div>

        <h2 className="text-3xl font-extrabold text-white mb-1">Hra skončila!</h2>

        {winner && (
          <p className="text-lg mb-4" style={{ color: COLOR_HEX[winner.color] }}>
            <span className="font-bold">{winner.name}</span> vítězí s{" "}
            {winner.territoriesOwned} územími!
          </p>
        )}

        {/* Scoreboard */}
        <div className="bg-gray-800 rounded-xl p-4 mb-5 text-left">
          <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-3 font-semibold">
            Výsledková tabulka
          </h3>
          {sorted.map((p, i) => (
            <div
              key={p.id}
              className={[
                "flex items-center gap-3 py-2 border-b border-gray-700 last:border-0",
              ].join(" ")}
            >
              <span className="text-gray-400 text-sm w-5 text-center font-bold">
                {i + 1}.
              </span>
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: COLOR_HEX[p.color] }}
              />
              <span className="flex-1 text-white font-medium">{p.name}</span>
              <span className="text-gray-300 text-sm">
                🗺️ {p.territoriesOwned}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors text-base"
        >
          Zpět na hlavní menu
        </button>
      </div>
    </div>
  );
}
