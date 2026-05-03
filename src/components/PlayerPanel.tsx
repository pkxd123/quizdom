"use client";

import type { Player } from "@/lib/types";
import { COLOR_HEX } from "@/lib/types";

interface PlayerPanelProps {
  players: Player[];
  currentPlayerId: string | null;
  myPlayerId: string | null;
  roundsPerPlayer: number;
}

export default function PlayerPanel({
  players,
  currentPlayerId,
  myPlayerId,
  roundsPerPlayer,
}: PlayerPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-1">
        Hráči
      </h2>
      {players.map((player) => {
        const isCurrentTurn = player.id === currentPlayerId;
        const isMe = player.id === myPlayerId;
        const turnsUsed = roundsPerPlayer - player.turnsRemaining;
        const progressPct = (turnsUsed / roundsPerPlayer) * 100;

        return (
          <div
            key={player.id}
            className={[
              "rounded-xl p-3 border transition-all",
              isCurrentTurn
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-gray-700 bg-gray-800/60",
            ].join(" ")}
          >
            <div className="flex items-center gap-2 mb-1.5">
              {/* Color dot */}
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{
                  background: COLOR_HEX[player.color],
                  outline: isCurrentTurn ? `2px solid #facc15` : undefined,
                  outlineOffset: "2px",
                }}
              />
              {/* Name */}
              <span
                className={[
                  "font-semibold text-sm truncate flex-1",
                  isCurrentTurn ? "text-yellow-300" : "text-white",
                ].join(" ")}
              >
                {player.name}
                {isMe && (
                  <span className="ml-1 text-gray-400 font-normal text-xs">(ty)</span>
                )}
              </span>
              {/* Turn indicator */}
              {isCurrentTurn && (
                <span className="text-yellow-400 text-xs font-bold animate-pulse">
                  ▶ na tahu
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-gray-300">
                🗺️ <strong>{player.territoriesOwned}</strong> území
              </span>
              <span className="text-gray-300">
                🎯 <strong>{player.turnsRemaining}</strong> tahů
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2 bg-gray-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: COLOR_HEX[player.color],
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
