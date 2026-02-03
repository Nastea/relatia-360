// Simple, proven text chunker for RAG
export function chunkText(
  text: string,
  {
    maxChars = 1000,
    overlap = 150,
  }: { maxChars?: number; overlap?: number } = {}
) {
  const clean = text.replace(/\r/g, "").replace(/\t/g, "  ");
  const parts: string[] = [];
  let i = 0;

  while (i < clean.length) {
    let end = Math.min(i + maxChars, clean.length);

    // try to end on sentence boundary
    const boundary = clean.lastIndexOf(".", end);
    if (boundary > i + 400) end = boundary + 1;

    const slice = clean.slice(i, end).trim();
    if (slice) parts.push(slice);
    i = end - overlap; // overlap
    if (i < 0) i = 0;
  }
  return parts;
}
