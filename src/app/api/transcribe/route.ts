import { NextRequest } from "next/server";
import { openai } from "@/lib/openai";
import { prisma } from "@/lib/db";
import { costWhisper } from "@/lib/cost";


export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return Response.json({ error: "No file" }, { status: 400 });
    }

    const tr = await openai.audio.transcriptions.create({
      model: "whisper-1",
      file,
    });

// Try to read optional seconds from query (client can pass ?seconds=... later)
const url = new URL(req.url);
const secondsParam = url.searchParams.get("seconds");
const seconds = secondsParam ? Number(secondsParam) : null;
const minutes = seconds ? seconds / 60 : null;
const whCost = minutes ? costWhisper(minutes) : null;

await prisma.event.create({
  data: {
    id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: "transcribe",
    data: { seconds, minutes, cost: whCost } as any,
  },
});

return Response.json({ text: tr.text, seconds, minutes, cost: whCost });
  } catch (err: any) {
    const status = err?.status ?? 500;
    const code = err?.code ?? "unknown_error";
    if (status === 429 && code === "insufficient_quota") {
      return Response.json(
        { error: "Project quota exhausted. Add credits and create a new API key." },
        { status: 429 }
      );
    }
    if (status === 429) {
      return Response.json({ error: "Rate limit hit. Please retry soon." }, { status: 429 });
    }
    console.error("Transcribe error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
    
  }

  
}
