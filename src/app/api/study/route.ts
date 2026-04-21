// src/app/api/study/route.ts

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    
    // Check if deckId is actually present in the request
    const { cardId, deckId, quality } = body;

    if (!deckId) {
      console.error("Error: deckId is missing from request body");
      return new NextResponse("Missing Deck ID", { status: 400 });
    }

    const card = await prisma.flashcard.findUnique({
      where: { id: cardId },
    });

    if (!card) return new NextResponse("Card not found", { status: 404 });

    // SM-2 Logic (Simplified)
    let { repetition, efactor, interval } = card;
    if (quality >= 3) {
      interval = repetition === 0 ? 1 : repetition === 1 ? 6 : Math.round(interval * efactor);
      repetition++;
    } else {
      repetition = 0;
      interval = 1;
    }
    efactor = Math.max(1.3, efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    // Update Card
    await prisma.flashcard.update({
      where: { id: cardId },
      data: { repetition, efactor, interval, nextReview },
    });

    // Calculate Mastery
    const allCards = await prisma.flashcard.findMany({
      where: { deckId: deckId },
      select: { efactor: true }
    });

    const avgEF = allCards.reduce((acc, c) => acc + c.efactor, 0) / allCards.length;
    const masteryPercentage = Math.min(Math.round((avgEF / 2.5) * 100), 100);

    // This is the line that was failing because deckId was undefined
    await prisma.deck.update({
      where: { id: deckId },
      data: { mastery: masteryPercentage }
    });

    return NextResponse.json({ success: true, mastery: masteryPercentage });
  } catch (error) {
    console.error("[STUDY_POST_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}