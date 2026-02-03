import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { id: "asc" },
    include: { assets: true },
  });
  return Response.json({ lessons });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    objectives,   // array
    videoUrl,
    materialText,
    instructions,
    exercises,    // array de obiecte
  } = body || {};

  if (!title || !Array.isArray(objectives)) {
    return Response.json({ error: "title și objectives[] sunt obligatorii" }, { status: 400 });
  }

  const lesson = await prisma.lesson.create({
    data: {
      title,
      objectives,
      videoUrl: videoUrl || null,
      materialText: materialText || null,
      instructions: instructions || null,
      exercises: exercises || null,
    },
    include: { assets: true },
  });

  return Response.json({ lesson });
}
