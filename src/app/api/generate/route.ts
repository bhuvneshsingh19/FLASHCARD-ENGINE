import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// 1. Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are an expert educator. Transform the provided text into a high-quality study deck.
### INSTRUCTION RULES:
1. Depth over Breadth: Identify core concepts, definitions, and relationships.
2. Mix of Difficulty: Include Level 1 (Recall), Level 2 (Conceptual), and Level 3 (Application).
3. Teacher's Voice: Write clear questions on the Front and thorough explanations on the Back.
4. Format: Return a JSON object with 'title', 'description', and a 'cards' array.
`;

export async function POST(request: Request) {
  try {
    // 2. Auth Check (Crucial for MongoDB/Clerk integration)
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text: extractedText } = await request.json();

    if (!extractedText) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    // 3. OpenAI Generation
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transform the following text into 10-12 high-quality flashcards: ${extractedText}` }
      ],
      response_format: { type: "json_object" },
    });

    const aiContent = response.choices[0].message.content;
    if (!aiContent) throw new Error("AI failed to generate content");
    
    const aiResponse = JSON.parse(aiContent);

    // 4. Save to MongoDB using Prisma
    // Note: 'userId' links this deck to your Clerk account
    const deck = await prisma.deck.create({
      data: {
        title: aiResponse.title || "Untitled Deck",
        description: aiResponse.description || "Generated from PDF",
        userId: userId, // Links the deck to you!
        cards: {
          create: aiResponse.cards.map((card: any) => ({
            front: card.front,
            back: card.back,
            interval: 0,
            repetition: 0,
            efactor: 2.5,
            nextReview: new Date(),
          })),
        },
      },
    });

    return NextResponse.json(deck);
  } catch (error) {
    console.error("Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate study materials. Please try again." }, 
      { status: 500 }
    );
  }
}