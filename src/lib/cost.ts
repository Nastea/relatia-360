// Centralized cost helpers. Rates are USD. Override via env if needed.

const num = (v: string | undefined, def: number) =>
  v ? Number(v) : def;

// ---- Chat model (default = GPT‑4.1 mini) ----
export const CHAT_INPUT_PER_M = num(process.env.COST_CHAT_INPUT_PER_M, 0.40); // $ per 1M input tokens
export const CHAT_OUTPUT_PER_M = num(process.env.COST_CHAT_OUTPUT_PER_M, 1.60); // $ per 1M output tokens

// ---- Embeddings (text-embedding-3-small) ----
export const EMBED_PER_M = num(process.env.COST_EMBED_PER_M, 0.02); // $ per 1M tokens

// ---- Whisper transcription ----
export const WHISPER_PER_MIN = num(process.env.COST_WHISPER_PER_MIN, 0.006); // $ per minute

// Helpers
export function usd(n: number) {
  return `$${n.toFixed(4)}`;
}
export function costChat(promptTokens = 0, completionTokens = 0) {
  const inCost = (promptTokens / 1_000_000) * CHAT_INPUT_PER_M;
  const outCost = (completionTokens / 1_000_000) * CHAT_OUTPUT_PER_M;
  return { inCost, outCost, total: inCost + outCost };
}
export function costEmbed(tokens = 0) {
  return (tokens / 1_000_000) * EMBED_PER_M;
}
export function costWhisper(minutes = 0) {
  return minutes * WHISPER_PER_MIN;
}

// Very rough estimate: 1 token ~ 4 chars (English).
export function estimateTokensFromChars(charCount: number) {
  return Math.ceil(charCount / 4);
}
