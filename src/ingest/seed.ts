import "dotenv/config";
import { upsertDocs } from "@/lib/rag";

const l1 = `
Thought–Feeling–Behavior Loop:
Situations trigger automatic thoughts -> feelings -> behaviors.
Practice table: Situation | Automatic thought | Feeling (0–100) | Behavior.
Then: Evidence for & against; Balanced alternative thought; Tiny experiment.
`;

const l2 = `
Cognitive Reframing:
Identify cognitive distortions (e.g., catastrophizing, mind reading).
Write the thought, distortion label, evidence, alternative balanced thought.
`;

const l3 = `
Behavioral Activation:
When mood is low, plan small valued activities.
Rate expected pleasure (P) and mastery (M) 0–10; do it; rate actual P/M; adjust next step.
`;

async function main() {
  await upsertDocs([
    { id: "l1-c1", text: l1, meta: { lesson: 1, section: "loop" } },
    { id: "l2-c1", text: l2, meta: { lesson: 2, section: "reframe" } },
    { id: "l3-c1", text: l3, meta: { lesson: 3, section: "activation" } },
  ]);
  console.log("Seeded lessons 1–3.");
}
main();
