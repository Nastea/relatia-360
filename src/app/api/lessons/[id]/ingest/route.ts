import { prisma } from "@/lib/db";
import { upsertDocs } from "@/lib/rag";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const lessonId = Number(params.id);
  const l = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!l) return Response.json({ error: "Lesson not found" }, { status: 404 });

  const material = (l.materialText || "").trim();
  if (!material) {
    return Response.json({ error: "materialText este gol" }, { status: 400 });
  }

  // Spargem în bucăți ~1000 caractere
  const chunks: { id: string; text: string; meta: any }[] = [];
  const size = 1000;
  for (let i = 0; i < material.length; i += size) {
    chunks.push({
      id: `lesson${lessonId}-${i / size}`,
      text: material.slice(i, i + size),
      meta: { lesson: lessonId, source: "materialText" },
    });
  }

  await upsertDocs(chunks);
  return Response.json({ ok: true, count: chunks.length });
}
