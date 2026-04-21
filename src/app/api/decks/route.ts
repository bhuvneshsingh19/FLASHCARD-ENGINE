import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const decks = await prisma.deck.findMany({
      where: { userId },
      include: {
        cards: true, // Needed for the "Due for Review" logic
        _count: {
          select: { cards: true } // Needed for the "X Flashcards" label
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(decks);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}