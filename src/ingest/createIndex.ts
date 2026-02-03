import "dotenv/config";
import { Pinecone } from "@pinecone-database/pinecone";
import "dotenv/config";


async function main() {
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
  const name = process.env.PINECONE_INDEX!;
  const cloud = (process.env.PINECONE_CLOUD || "aws") as "aws" | "gcp" | "azure";
  const region = process.env.PINECONE_REGION || "eu-west-1";

  const list = await pc.listIndexes();
  if (list.indexes?.some((i) => i.name === name)) {
    console.log("Index already exists:", name);
    return;
  }

  await pc.createIndex({
    name,
    dimension: 1536,
    metric: "cosine",
    spec: { serverless: { cloud, region } },
  });

  for (;;) {
    const d = await pc.describeIndex(name);
    if (d.status?.ready) break;
    console.log("Waiting for index to be ready…");
    await new Promise((r) => setTimeout(r, 4000));
  }
  console.log("Index ready:", name);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
