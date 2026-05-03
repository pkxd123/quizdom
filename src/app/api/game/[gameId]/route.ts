import { NextRequest, NextResponse } from "next/server";
import { getGame, joinGame, startGame, purgeStaleGames } from "@/lib/gameStore";

interface Params {
  params: Promise<{ gameId: string }>;
}

// GET /api/game/[gameId] – poll game state
export async function GET(_req: NextRequest, { params }: Params) {
  purgeStaleGames();
  const { gameId } = await params;
  const game = getGame(gameId);
  if (!game) {
    return NextResponse.json({ error: "Hra nenalezena." }, { status: 404 });
  }
  return NextResponse.json(game);
}

// POST /api/game/[gameId] – join or start
export async function POST(req: NextRequest, { params }: Params) {
  const { gameId } = await params;
  try {
    const body = await req.json();
    const { action, playerName, playerId } = body;

    if (action === "join") {
      if (!playerName || typeof playerName !== "string") {
        return NextResponse.json({ error: "Zadej jméno hráče." }, { status: 400 });
      }
      const result = joinGame(gameId, playerName.trim());
      if ("error" in result) {
        return NextResponse.json(result, { status: 400 });
      }
      return NextResponse.json(result);
    }

    if (action === "start") {
      if (!playerId) {
        return NextResponse.json({ error: "Chybí playerId." }, { status: 400 });
      }
      const result = startGame(gameId, playerId);
      if (!result.success) {
        return NextResponse.json(result, { status: 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Neznámá akce." }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Chyba serveru." }, { status: 500 });
  }
}
