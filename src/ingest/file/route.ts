import { NextRequest } from "next/server";
import { upsertDocs } from "@/lib/rag";
import { chunkText } from "@/lib/chunk";
import { prisma } from "@/lib/db";
import { costEmbed, estimateTokensFromChars } from "@/lib/cost";


import pdfParse, { type Result as PdfResult } from "pdf-parse";

async function extractFromPDF(buffer: Buffer): Promise<string> {
  const res: PdfResult = await pdfParse(buffer);
  return res.text ?? "";
}


export const runtime = "nodejs";



export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file");
  const lesson = Number(form.get("lesson") ?? 0) || undefined;
  const section =
    typeof form.get("section") === "string" ? (form.get("section") as string) : undefined;

  if (!file || !(file instanceof File)) {
    return Response.json({ error: "No file" }, { status: 400 });
  }

  const arrayBuf = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuf);

  let text = "";
  const mime = file.type || "";
  const name = file.name?.toLowerCase() || "";

  if (mime.includes("pdf") || name.endsWith(".pdf")) {
    text = await extractFromPDF(buf);
  } else if (mime.startsWith("text/") || name.endsWith(".txt") || name.endsWith(".md")) {
    text = buf.toString("utf8");
  } else {
    return Response.json({ error: "Unsupported file type" }, { status: 400 });
  }

  if (!text.trim()) {
    return Response.json({ error: "No text extracted" }, { status: 400 });
  }

  const chunks = chunkText(text);
const base = `${lesson ?? "gen"}-${Date.now()}`;
const items = chunks.map((t, i) => ({
  id: `${base}-${i}`,
  text: t,
  meta: { lesson, section, filename: file.name },
}));

await upsertDocs(items);

// Estimate tokens & cost
const chars = items.reduce((s, it) => s + it.text.length, 0);
const tokens = estimateTokensFromChars(chars);
const embedCost = costEmbed(tokens);

// Log Event (no user/session context here yet; add when you add auth)
await prisma.event.create({
  data: {
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "embed_upsert",
    data: {
      filename: file.name,
      lesson,
      section,
      chunks: items.length,
      chars,
      tokens,
      cost: embedCost,
    } as any,
  },
});

return Response.json({
  ok: true,
  count: items.length,
  lesson,
  section,
  filename: file.name,
  tokenEstimate: tokens,
  embedCost,
});

}
