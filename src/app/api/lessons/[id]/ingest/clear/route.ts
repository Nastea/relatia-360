import { NextRequest } from "next/server";
import { deleteByLesson } from "@/lib/rag"; // trebuie implementat în lib/rag

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const lessonId = Number(params.id);
  if (!Number.isFinite(lessonId)) return Response.json({ error: "Invalid id" }, { status: 400 });
  const n = await deleteByLesson(lessonId);
  return Response.json({ ok: true, deleted: n });
}
