import { TERRITORY_PATHS, TERRITORY_LABELS } from "@/lib/territories";
import type { Territory, Player } from "@/lib/types";
import { COLOR_HEX } from "@/lib/types";

interface CzechMapProps {
  territories: Record<string, Territory>;
  players: Player[];
  currentPlayerId: string | null;
  onTerritoryClick: (territoryId: string) => void;
  disabled?: boolean;
  pendingTerritoryId?: string | null;
}

const UNCLAIMED_COLOR = "#374151"; // gray-700
const BORDER_COLOR = "#1f2937"; // gray-800

// Abbreviated display names for SVG labels (space-constrained regions)
const TERRITORY_LABELS_DISPLAY: Record<string, string> = {
  karlovarsky: "Karlovy V.",
  ustecky: "Ústecký",
  liberecky: "Liberec",
  kralovehradecky: "K.Hrad.",
  pardubicky: "Pardub.",
  stredocesky: "Středočes.",
  praha: "Praha",
  plzensky: "Plzeňský",
  jihocesky: "Jihočes.",
  vysocina: "Vysočina",
  jihomoravsky: "Jihomor.",
  olomoucky: "Olomouc",
  zlinsky: "Zlínský",
  moravskoslezsky: "Msl.",
};

function getLabelFontSize(territoryId: string): string {
  if (territoryId === "praha") return "8";
  if (territoryId === "liberecky") return "9";
  return "10";
}

function getPlayerColor(territory: Territory, players: Player[]): string {
  if (!territory.ownerId) return UNCLAIMED_COLOR;
  const player = players.find((p) => p.id === territory.ownerId);
  if (!player) return UNCLAIMED_COLOR;
  return COLOR_HEX[player.color];
}

export default function CzechMap({
  territories,
  players,
  currentPlayerId,
  onTerritoryClick,
  disabled = false,
  pendingTerritoryId,
}: CzechMapProps) {
  const currentPlayer = players.find((p) => p.id === currentPlayerId);

  const isClickable = (territory: Territory): boolean => {
    if (disabled) return false;
    if (!currentPlayer) return false;
    // Can't click own territory
    return territory.ownerId !== currentPlayerId;
  };

  const getFillColor = (territory: Territory): string => {
    if (pendingTerritoryId === territory.id) return "#fbbf24"; // yellow highlight
    return getPlayerColor(territory, players);
  };

  const getOwnerName = (territory: Territory): string => {
    if (!territory.ownerId) return "Volné";
    const player = players.find((p) => p.id === territory.ownerId);
    return player?.name ?? "Neznámý";
  };

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 800 460"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-h-[480px] drop-shadow-2xl"
        style={{ background: "transparent" }}
      >
        {/* Map background / shadow */}
        <defs>
          <filter id="territory-shadow" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Render all territories */}
        {Object.values(territories).map((territory) => {
          const path = TERRITORY_PATHS[territory.id];
          if (!path) return null;

          const fillColor = getFillColor(territory);
          const clickable = isClickable(territory);
          const ownerName = getOwnerName(territory);
          const label = TERRITORY_LABELS[territory.id];
          const labelText = TERRITORY_LABELS_DISPLAY[territory.id] ?? territory.name;
          const fontSize = getLabelFontSize(territory.id);

          return (
            <g key={territory.id}>
              <polygon
                points={path}
                fill={fillColor}
                stroke={BORDER_COLOR}
                strokeWidth="2"
                strokeLinejoin="round"
                filter="url(#territory-shadow)"
                style={{
                  cursor: clickable ? "pointer" : "default",
                  transition: "fill 0.2s ease",
                  opacity: disabled && territory.ownerId !== currentPlayerId ? 0.85 : 1,
                }}
                className={clickable ? "hover:brightness-125 active:brightness-150" : ""}
                onClick={() => clickable && onTerritoryClick(territory.id)}
              >
                <title>
                  {territory.name} – {ownerName}
                </title>
              </polygon>

              {/* Territory label */}
              {label && (
                <text
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fontSize}
                  fontWeight="600"
                  fill="white"
                  style={{
                    pointerEvents: "none",
                    textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                    userSelect: "none",
                  }}
                  className="select-none"
                >
                  {labelText}
                </text>
              )}
            </g>
          );
        })}

        {/* Praha dot (extra visibility for small territory) */}
        {territories["praha"] && (
          <circle
            cx={TERRITORY_LABELS["praha"].x}
            cy={TERRITORY_LABELS["praha"].y - 12}
            r="5"
            fill={getFillColor(territories["praha"])}
            stroke={BORDER_COLOR}
            strokeWidth="1.5"
            style={{ pointerEvents: "none" }}
          />
        )}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-3 px-2 justify-center">
        <span className="flex items-center gap-1.5 text-xs text-gray-400">
          <span
            className="inline-block w-3 h-3 rounded-sm border border-gray-600"
            style={{ background: UNCLAIMED_COLOR }}
          />
          Volné
        </span>
        {players.map((p) => (
          <span key={p.id} className="flex items-center gap-1.5 text-xs text-gray-300">
            <span
              className="inline-block w-3 h-3 rounded-sm border border-gray-600"
              style={{ background: COLOR_HEX[p.color] }}
            />
            {p.name} ({p.territoriesOwned})
          </span>
        ))}
      </div>
    </div>
  );
}
