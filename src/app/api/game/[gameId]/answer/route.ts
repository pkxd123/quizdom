import { NextRequest, NextResponse } from "next/server";
import { answerQuestion, purgeStaleGames } from "@/lib/gameStore";

interface Params {
  params: Promise<{ gameId: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  purgeStaleGames();
  const { gameId } = await params;
  try {
    const body = await req.json();
    const { playerId, answer, responseTimeMs } = body;

    if (!playerId || answer === undefined || answer === null) {
      return NextResponse.json(
        { error: "Chybí playerId nebo odpověď." },
        { status: 400 }
      );
    }

    const result = answerQuestion(
      gameId,
      playerId,
      answer,
      responseTimeMs ?? 0
    );
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Chyba serveru." }, { status: 500 });
  }
}
