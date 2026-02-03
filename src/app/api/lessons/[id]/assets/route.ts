import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lessonId = Number(id);
  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return Response.json({ error: "Lesson not found" }, { status: 404 });

  const form = await req.formData();
  const file = form.get("file");
  if (!file || !(file instanceof File)) {
    return Response.json({ error: "file required" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const safe = `${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
  const rel = path.join("uploads", safe);
  const abs = path.join(process.cwd(), "public", rel);

  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, buf);

  const asset = await prisma.lessonAsset.create({
    data: {
      id: `asset_${Date.now()}`,
      lessonId,
      kind: "pdf",
      filename: file.name,
      size: buf.length,
      mime: file.type || "application/pdf",
      path: `/${rel}`,
    },
  });

  return Response.json({ asset });
}
