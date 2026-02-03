import { openai } from "@/lib/openai";

export type ModerationResult = {
  flagged: boolean;
  categories?: any;
  input?: string;
};

export async function moderateText(input: string): Promise<ModerationResult> {
  if (!openai) {
    // Return safe default if OpenAI is not configured
    return {
      flagged: false,
      input,
    };
  }
  const res = await openai.moderations.create({
    model: "omni-moderation-latest",
    input,
  });
  const result = res.results?.[0] as any;
  return {
    flagged: !!result?.flagged,
    categories: result?.categories,
    input,
  };
}
