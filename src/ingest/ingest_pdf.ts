import fs from "node:fs/promises";
import pdfParse from "pdf-parse";
import { upsertDocs } from "@/lib/rag";

async function main() {
  const lessonId = Number(process.argv[2]);
  const file = process.argv[3];

  if (!Number.isFinite(lessonId) || !file) {
    console.log("Usage: pnpm tsx src/ingest/ingest_pdf.ts <lessonId> </abs/path/file.pdf>");
    process.exit(1);
  }

  const buf = await fs.readFile(file);
  const pdf = await pdfParse(buf);
  const text = pdf.text;

  const chunks: { id: string; text: string; meta: any }[] = [];
  const size = 1000;
  for (let i = 0; i < text.length; i += size) {
    chunks.push({
      id: `lesson${lessonId}-pdf-${i / size}`,
      text: text.slice(i, i + size),
      meta: { lesson: lessonId, source: "pdf" },
    });
  }

  await upsertDocs(chunks);
  console.log(`Ingested ${chunks.length} chunks for lesson ${lessonId} from PDF`);
}

main().catch((e) => (console.error(e), process.exit(1)));
