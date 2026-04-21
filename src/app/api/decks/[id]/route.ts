import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Await params for Next.js 16 compatibility
    const { id } = await params;

    // 2. Fetch the deck using the exact relation name from your schema
    const deck = await prisma.deck.findUnique({
      where: { 
        id: id 
      },
      include: { 
        // Changed from 'flashcards' to 'cards' to match your schema
        cards: true 
      },
    });

    // 3. Handle 404 if deck doesn't exist
    if (!deck) {
      return NextResponse.json(
        { error: "Deck not found" }, 
        { status: 404 }
      );
    }

    return NextResponse.json(deck);
  } catch (error) {
    console.error("Error fetching deck:", error);
    return NextResponse.json(
      { error: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}