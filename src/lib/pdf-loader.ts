export function cleanPDFText(text: string): string {
  return text
    .replace(/\s+/g, ' ')           // Remove multiple spaces/newlines
    .replace(/(\r\n|\n|\r)/gm, " ") // Normalize line breaks
    .replace(/\x00/g, '')           // Remove null characters
    .trim();
}

export function chunkText(text: string, maxLength: number = 12000): string {
  // If the PDF is massive, we take the most relevant first 12k characters
  // to avoid hitting OpenAI token limits for a prototype.
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "... [Text Truncated]";
}