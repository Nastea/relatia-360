import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { assets: true },
  });

  if (!lesson) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ lesson });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  let payload: {
    title?: string;
    objectives?: unknown;
    videoUrl?: string | null;
    materialText?: string | null;
    instructions?: string | null;
    coachScript?: string | null; // <— NOU
    exercises?: unknown;
  };

  try {
    payload = (await req.json()) as typeof payload;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.title) {
    return Response.json({ error: "Missing title" }, { status: 400 });
  }

  // asigurăm tipajul minim corect pentru JSON-uri
  const objectives =
    Array.isArray(payload.objectives) ? (payload.objectives as unknown[]) : [];
  const exercises =
    Array.isArray(payload.exercises) ? (payload.exercises as unknown[]) : [];

  const data = {
    title: payload.title,
    objectives: objectives,
    videoUrl: payload.videoUrl ?? null,
    materialText: payload.materialText ?? null,
    instructions: payload.instructions ?? null,
    coachScript: payload.coachScript ?? null, // <— NOU
    exercises: exercises,
  };

  const lesson = await prisma.lesson.update({
    where: { id },
    data,
    include: { assets: true },
  });

  return Response.json({ lesson });
}
