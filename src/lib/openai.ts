import OpenAI from "openai";

// Only initialize OpenAI if API key is provided (for AI features)
// This allows the site to build without AI features if API key is missing
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

export { openai }; // ✅ export corect instanța (poate fi null dacă nu există API key)
export const DEFAULT_MODEL = "gpt-4o";
export const EMBEDDING_MODEL = "text-embedding-3-small"; // ✅ necesar pentru RAG

export async function generateCoachResponse(message: string, lessonId: number, flowState: string) {
  if (!openai) {
    throw new Error("OpenAI API key is not configured. AI features are disabled.");
  }

  const prompt = buildPrompt(message, lessonId, flowState);

  const res = await openai.chat.completions.create({
    model: DEFAULT_MODEL,
    temperature: 0.9,
    messages: [
      { role: "system", content: prompt.system },
      { role: "user", content: prompt.user }
    ]
  });

  return res.choices[0].message.content ?? "";
}

function buildPrompt(message: string, lessonId: number, flowState: string) {
  const system = `
Ești un coach empatic. Ghidezi conversația pentru lecția #${lessonId}, în flow-ul: ${flowState}.
Nu predai. Nu explici lecția. Doar întrebi, reflectezi și încurajezi. Ton cald, natural, fără repetiții.`;

  const user = `Mesaj de la utilizator: ${message}`;

  return { system, user };
}
