import { Pinecone } from "@pinecone-database/pinecone";
import { openai, EMBEDDING_MODEL } from "@/lib/openai";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const indexName = process.env.PINECONE_INDEX!;
const namespace = process.env.PINECONE_NAMESPACE || "prod";
const index = pc.index(indexName);

export type Meta = {
  text: string;
  lesson?: number;
  section?: string;
  userId?: string;
  [k: string]: any;
};

export async function embed(text: string) {
  const e = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return e.data[0].embedding;
}

export async function upsertDocs(
  items: { id: string; text: string; meta?: Omit<Meta, "text"> }[],
  ns: string = namespace
) {
  const vectors = await Promise.all(
    items.map(async (it) => ({
      id: it.id,
      values: await embed(it.text),
      metadata: { text: it.text, ...(it.meta || {}) } as Meta,
    }))
  );
  await index.namespace(ns).upsert(vectors);
}

export async function retrieve(
  query: string,
  k = 6,
  filter?: Record<string, any>,
  ns: string = namespace
) {
  const vector = await embed(query);
  const res = await index.namespace(ns).query({
    vector,
    topK: k,
    includeMetadata: true,
    filter, // e.g., { lesson: 1 } to limit results
  });
  return (
    res.matches?.map((m) => ({
      id: m.id,
      score: m.score ?? 0,
      text: (m.metadata as any)?.text as string,
    })) ?? []
  );
}


// --- CLEAR HELPERS ----------------------------------------------------------

/**
 * Deletes all vectors for a given lesson from the vector store.
 * Returns the count of deleted items (if the backend can provide it).
 *
 * Current implementation is a no-op stub so the app compiles and runs.
 * Swap with a real implementation for your vector DB (Pinecone/Qdrant/etc.).
 */
export async function deleteByLesson(lessonId: number): Promise<number> {
  console.warn("[RAG] deleteByLesson is a stub. Lesson:", lessonId);
  return 0;
}
