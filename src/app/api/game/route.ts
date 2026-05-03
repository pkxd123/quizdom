import { NextRequest, NextResponse } from "next/server";
import { createGame } from "@/lib/gameStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerName, roundsPerPlayer, maxPlayers } = body;

    if (!playerName || typeof playerName !== "string" || playerName.trim().length < 1) {
      return NextResponse.json({ error: "Zadej jméno hráče." }, { status: 400 });
    }

    const result = createGame(
      playerName.trim(),
      roundsPerPlayer ?? 10,
      maxPlayers ?? 6
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Chyba serveru." }, { status: 500 });
  }
}
