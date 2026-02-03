import { NextRequest } from "next/server";
import { upsertDocs } from "@/lib/rag";
import { chunkText } from "@/lib/chunk";
import { prisma } from "@/lib/db";
import { costEmbed, estimateTokensFromChars } from "@/lib/cost";


export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.text !== "string") {
    return Response.json({ error: "Missing text" }, { status: 400 });
  }
  const lesson = Number(body.lesson ?? 0) || undefined;
  const section = typeof body.section === "string" ? body.section : undefined;

  const chunks = chunkText(body.text);
  const items = chunks.map((text, idx) => ({
    id: `${lesson ?? "gen"}-${Date.now()}-${idx}`,
    text,
    meta: { lesson, section },
  }));

 await upsertDocs(items);

// estimate + event
const chars = items.reduce((s, it) => s + it.text.length, 0);
const tokens = estimateTokensFromChars(chars);
const embedCost = costEmbed(tokens);

await prisma.event.create({
  data: {
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "embed_upsert",
    data: { lesson, section, chunks: items.length, chars, tokens, cost: embedCost } as any,
  },
});

return Response.json({ ok: true, count: items.length, tokenEstimate: tokens, embedCost });

}
