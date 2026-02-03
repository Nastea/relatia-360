// src/app/api/chat/route.ts

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { openai, DEFAULT_MODEL } from "@/lib/openai";
import { retrieve } from "@/lib/rag";
import { universalCoachPrompt } from "@/lib/prompts";
import { LRUCache } from "lru-cache";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export const runtime = "nodejs";

const rl = new LRUCache<string, number>({ max: 2000 });
function rateLimit(ip: string, max = 40, window = 60000) {
  const n = (rl.get(ip) ?? 0) + 1;
  rl.set(ip, n, { ttl: window });
  return n > max;
}

async function complete(messages: ChatCompletionMessageParam[]) {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. AI features are disabled.");
  }
  const comp = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    messages,
  });
  return comp.choices[0].message.content ?? "…";
}

type ExerciseStep = {
  title?: string;
  prompt?: string;
  [key: string]: unknown;
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    if (rateLimit(ip)) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const messageRaw: string = String(body.message ?? "").trim();
    const lessonId = body.lessonId ? Number(body.lessonId) : undefined;
    const userId: string = body.userId || "u_anon";
    const sessionId: string = body.sessionId || `s_${Date.now()}`;

    await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, anon: true },
    });

    await prisma.session.upsert({
      where: { id: sessionId },
      update: { userId, ...(lessonId ? { lessonId } : {}) },
      create: {
        id: sessionId,
        userId,
        ...(lessonId ? { lessonId } : {}),
        videoWatched: false,
        exerciseStep: 0,
        exerciseStarted: false,
        exerciseCompleted: false,
        flowState: "intro",
      },
    });

    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) throw new Error("Session not found");

    const lesson = lessonId ? await prisma.lesson.findUnique({ where: { id: lessonId } }) : null;
    const hasVideo = Boolean(lesson?.videoUrl);
    const exercises = Array.isArray(lesson?.exercises) ? lesson.exercises : [];

    const currentRaw = session.exerciseStep < exercises.length ? exercises[session.exerciseStep] : null;
    const current = typeof currentRaw === "object" && currentRaw !== null ? (currentRaw as ExerciseStep) : null;

    let coachContext = `You are a psychology coach helping the user progress through a lesson in a natural, conversational way.

Lesson metadata:
- Title: ${lesson?.title ?? "Unknown"}
- Video URL: ${lesson?.videoUrl ?? "N/A"}
- Has video: ${hasVideo ? "yes" : "no"}
- User has watched video: ${session.videoWatched ? "yes" : "no"}
- Number of exercises: ${exercises.length}
- Current exercise step: ${session.exerciseStep}
- Exercises completed: ${session.exerciseCompleted ? "yes" : "no"}

Guidelines:
1. If the video hasn't been watched yet, invite the user warmly to watch it and send the video link (${lesson?.videoUrl}).
2. Once they confirm watching, offer a short summary if they ask.
3. Then guide them into the first exercise.
4. Go step-by-step through each exercise, waiting for the user's input before continuing.
5. After the last exercise, invite them to reflect on the experience.
6. Stay empathetic and natural. Don't repeat questions unnecessarily. Don’t assume anything unless confirmed by the user.
7. Avoid jumping ahead in the process unless the user skips ahead naturally.`;

    if (current?.prompt) {
      coachContext += `\n\nPrompt for current exercise step:\n${current.prompt}`;
    }

    const ragHits = await retrieve(messageRaw, 4, lessonId ? { lesson: lessonId } : undefined);
    const ragContext =
      ragHits.length > 0
        ? `Context:\n${ragHits.map((h, i) => `(#${i + 1}) ${h.text}`).join("\n\n")}`
        : "Fii empatic și natural. Nu inventa detalii.";

    const msgs: ChatCompletionMessageParam[] = [
      { role: "system", content: universalCoachPrompt },
      { role: "system", content: coachContext },
      { role: "system", content: ragContext },
      { role: "user", content: messageRaw },
    ];

    const reply = await complete(msgs);

    await prisma.message.createMany({
      data: [
        { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, userId, sessionId, role: "user", content: messageRaw },
        { id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`, userId, sessionId, role: "assistant", content: reply },
      ],
    });

    return Response.json({ content: reply, sessionId, userId });
  } catch (err: any) {
    console.error("API_CHAT_ERROR", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
