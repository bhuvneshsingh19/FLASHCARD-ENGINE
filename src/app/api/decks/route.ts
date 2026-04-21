import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"; // Use the /server export

export async function GET() {
  try {
    // 1. Await the auth() promise to get the user context
    const { userId } = await auth();

    // 2. Security Check: If not logged in, block the request
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // 3. Fetch ONLY the decks belonging to this specific user
    const decks = await prisma.deck.findMany({
      where: { userId: userId },
      include: {
        cards: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    // 4. Calculate Mastery Stats for the Dashboard
    const decksWithStats = decks.map((deck) => {
      const totalCards = deck.cards.length;
      
      const masteredCards = deck.cards.filter(
        (c) => c.efactor > 2.2 && c.repetition > 1
      ).length;

      const dueCards = deck.cards.filter(
        (c) => new Date(c.nextReview) <= now
      ).length;

      const masteryPercent = totalCards > 0 
        ? Math.round((masteredCards / totalCards) * 100) 
        : 0;

      return {
        ...deck,
        totalCards,
        dueCards,
        masteryPercent,
      };
    });

    return NextResponse.json(decksWithStats);
  } catch (error) {
    console.error("Fetch Decks Error:", error);
    return NextResponse.json({ error: "Failed to fetch decks" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!id) return NextResponse.json({ error: "Deck ID required" }, { status: 400 });

    // Verify ownership before deleting
    const deck = await prisma.deck.findUnique({ where: { id } });
    if (deck?.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.deck.delete({ where: { id } });

    return NextResponse.json({ message: "Deck deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete deck" }, { status: 500 });
  }
}