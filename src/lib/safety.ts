const PATTERNS = [
  /suicide|self[-\s]?harm|want to die|kill myself/i,
  /immediate danger|in danger right now|plan to harm/i,
  /abuse|domestic violence|being hurt at home/i,
  /overdose|cutting myself/i,
];

export function isFlagged(text: string) {
  return PATTERNS.some((re) => re.test(text));
}
