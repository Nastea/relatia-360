export function logUsage(where: string, usage: any, model: string) {
  if (!usage) return;
  console.log(`[usage] ${where}`, {
    model,
    prompt: usage.prompt_tokens ?? 0,
    completion: usage.completion_tokens ?? 0,
    total: usage.total_tokens ?? 0,
  });
}
