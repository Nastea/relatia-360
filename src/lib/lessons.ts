import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type LessonMeta = {
  lesson: number;
  title: string;
  objectives?: string[];
  tone?: string;
  exercises?: string[];
  disclaimers?: string[];
  body?: string;
};

const cache = new Map<number, LessonMeta>();
const baseDir = path.join(process.cwd(), "src", "content", "lessons");

export async function loadLesson(lessonId?: number): Promise<LessonMeta | null> {
  if (!lessonId) return null;
  if (cache.has(lessonId)) return cache.get(lessonId)!;

  const file = path.join(baseDir, `${lessonId}.md`);
  const raw = await fs.readFile(file, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as any;
  const meta: LessonMeta = {
    lesson: Number(data.lesson),
    title: String(data.title || ""),
    objectives: Array.isArray(data.objectives) ? data.objectives.map(String) : [],
    tone: data.tone ? String(data.tone) : undefined,
    exercises: Array.isArray(data.exercises) ? data.exercises.map(String) : [],
    disclaimers: Array.isArray(data.disclaimers) ? data.disclaimers.map(String) : [],
    body: String(parsed.content || "").trim(),
  };
  cache.set(lessonId, meta);
  return meta;
}

export function composeLessonSystemPrompt(meta: LessonMeta): string {
  const lines: string[] = [];
  lines.push(`You are a supportive skills coach for Lesson ${meta.lesson}: ${meta.title}.`);
  if (meta.tone) lines.push(`Tone: ${meta.tone}.`);
  if (meta.objectives?.length) {
    lines.push("Objectives:");
    meta.objectives.forEach((o, i) => lines.push(`- (${i + 1}) ${o}`));
  }
  if (meta.exercises?.length) {
    lines.push("Preferred exercise patterns to use when relevant:");
    meta.exercises.forEach((e, i) => lines.push(`- [E${i + 1}] ${e}`));
  }
  if (meta.body) {
    lines.push("Lesson notes:");
    lines.push(meta.body);
  }
  if (meta.disclaimers?.length) {
    lines.push("Disclaimers to include briefly if the user asks for clinical guidance:");
    meta.disclaimers.forEach((d) => lines.push(`- ${d}`));
  }
  lines.push(
    "Style rules: be concise; offer 2–3 short steps; 1 tiny next action within 24 hours; ask 1 clarifying question when uncertain; avoid diagnosis or medical advice."
  );
  return lines.join("\n");
}
