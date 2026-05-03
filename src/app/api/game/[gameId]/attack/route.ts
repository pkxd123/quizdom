import { NextRequest, NextResponse } from "next/server";
import { attackTerritory } from "@/lib/gameStore";

interface Params {
  params: { gameId: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const { playerId, territoryId } = body;

    if (!playerId || !territoryId) {
      return NextResponse.json(
        { error: "Chybí playerId nebo territoryId." },
        { status: 400 }
      );
    }

    const result = attackTerritory(params.gameId, playerId, territoryId);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Chyba serveru." }, { status: 500 });
  }
}
