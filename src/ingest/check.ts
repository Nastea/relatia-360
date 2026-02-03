import "dotenv/config";
import { retrieve } from "@/lib/rag";

async function main() {
  const q = "thought feeling behavior loop exercise";
  const hits = await retrieve(q, 5, { lesson: 1 });
  console.log("Matches:", hits.length);
  for (const h of hits) {
    console.log(`- ${h.id}  score=${h.score.toFixed(3)}`);
    console.log(h.text.slice(0, 200).replace(/\s+/g, " ") + "...");
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
