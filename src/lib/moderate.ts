import { openai } from "@/lib/openai";

export type ModerationResult = {
  flagged: boolean;
  categories?: any;
  input?: string;
};

export async function moderateText(input: string): Promise<ModerationResult> {
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
