import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

// This is required to handle larger PDF files and older Node.js buffer logic in Next.js
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file found in request" }, 
        { status: 400 }
      );
    }

    // Convert File to Buffer for pdf-parse
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text
    const data = await pdf(buffer);

    // Clean up the text: 
    // 1. Remove excessive whitespace
    // 2. Remove null characters that sometimes appear in PDF parsing
    const cleanText = data.text
      .replace(/\s+/g, ' ')
      .replace(/\u0000/g, '')
      .trim();

    if (!cleanText || cleanText.length < 10) {
      return NextResponse.json(
        { error: "PDF seems to be empty or image-only (no selectable text)." }, 
        { status: 422 }
      );
    }

    // Return the text to the frontend to be sent to the AI generation route
    return NextResponse.json({ 
      text: cleanText,
      pageCount: data.numpages 
    });

  } catch (error: any) {
    console.error("PDF Extraction Error:", error);
    return NextResponse.json(
      { error: "Failed to extract text from PDF: " + error.message }, 
      { status: 500 }
    );
  }
}