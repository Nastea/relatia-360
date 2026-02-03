import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";
import { upsertDocs } from "@/lib/rag";

export const runtime = "nodejs";

type AssetDB = {
  id: string;
  filename: string;
  mime: string | null;
  size: number;
  path: string;
};
type LessonDB = {
  id: number;
  assets: AssetDB[];
};

function chunkText(text: string, size = 1000, overlap = 100) {
  const out: { id: string; text: string }[] = [];
  let start = 0;
  let idx = 0;
  while (start < text.length) {
    const end = Math.min(start + size, text.length);
    out.push({ id: `c${idx++}`, text: text.slice(start, end) });
    start = end - overlap;
    if (start < 0) start = 0;
  }
  return out;
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lessonId = Number(id);
  if (!Number.isFinite(lessonId)) {
    return Response.json({ error: "Invalid lesson id" }, { status: 400 });
  }

  const lesson = (await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { assets: true },
  })) as LessonDB | null;

  if (!lesson) return Response.json({ error: "Lesson not found" }, { status: 404 });

  const pdfs = lesson.assets.filter((a: AssetDB) => (a.mime || "").includes("pdf"));
  if (pdfs.length === 0) {
    return Response.json({ error: "No PDF assets for this lesson" }, { status: 400 });
  }

  let totalChunks = 0;

  for (const a of pdfs) {
    const rel = a.path.replace(/^\/+/, "");
    const abs = path.join(process.cwd(), "public", rel);

    const buf = await fs.readFile(abs);
    const pdfParse = (await import("pdf-parse")).default;
    const parsed = await pdfParse(buf);
    const text = (parsed.text || "").trim();
    if (!text) continue;

    const chunks = chunkText(text, 1000, 100).map((c, i) => ({
      id: `lesson${lessonId}-pdf-${a.id}-${i}`,
      text: c.text,
      meta: {
        lesson: lessonId,
        source: "pdf",
        filename: a.filename,
        assetId: a.id,
      },
    }));

    if (chunks.length) {
      await upsertDocs(chunks);
      totalChunks += chunks.length;
    }
  }

  return Response.json({ ok: true, pdfCount: pdfs.length, totalChunks });
}
