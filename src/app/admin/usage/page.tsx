import { prisma } from "@/lib/db";
import { usd, costChat } from "@/lib/cost";

type DayRow = { d: string; prompt: number; completion: number; total: number };
type ModelRow = { model: string; prompt: number; completion: number; total: number };
type LessonRow = { lessonId: number | null; prompt: number; completion: number; total: number };
type EmbedRow = { d: string; tokens: number; cost: number };
type TransRow = { d: string; minutes: number; cost: number };

export const dynamic = "force-dynamic";

export default async function UsageAdmin() {
  // Daily chat tokens
  const daily = (await prisma.$queryRawUnsafe(`
    SELECT DATE(createdAt) as d,
           SUM(CASE WHEN role='assistant' THEN promptTokens ELSE 0 END) as prompt,
           SUM(CASE WHEN role='assistant' THEN completionTokens ELSE 0 END) as completion,
           SUM(CASE WHEN role='assistant' THEN totalTokens ELSE 0 END) as total
    FROM Message
    GROUP BY DATE(createdAt)
    ORDER BY d DESC
    LIMIT 60
  `)) as any as DayRow[];

  // By lesson
  const byLesson = (await prisma.$queryRawUnsafe(`
    SELECT s.lessonId as lessonId,
           SUM(CASE WHEN m.role='assistant' THEN m.promptTokens ELSE 0 END) as prompt,
           SUM(CASE WHEN m.role='assistant' THEN m.completionTokens ELSE 0 END) as completion,
           SUM(CASE WHEN m.role='assistant' THEN m.totalTokens ELSE 0 END) as total
    FROM Message m
    JOIN Session s ON s.id = m.sessionId
    GROUP BY s.lessonId
    ORDER BY total DESC
  `)) as any as LessonRow[];

  // By model (single default for now)
  const byModel: ModelRow[] = [
    {
      model: "chat-default",
      prompt: daily.reduce((s, r) => s + (r.prompt || 0), 0),
      completion: daily.reduce((s, r) => s + (r.completion || 0), 0),
      total: daily.reduce((s, r) => s + (r.total || 0), 0),
    },
  ];

  // Embeddings by day
  const embedDaily = (await prisma.$queryRawUnsafe(`
    SELECT DATE(createdAt) as d,
           SUM(CAST(json_extract(data, '$.tokens') AS INTEGER)) as tokens,
           SUM(CAST(json_extract(data, '$.cost') AS REAL)) as cost
    FROM Event
    WHERE type = 'embed_upsert'
    GROUP BY DATE(createdAt)
    ORDER BY d DESC
    LIMIT 60
  `)) as any as EmbedRow[];

  // Transcription by day
  const transDaily = (await prisma.$queryRawUnsafe(`
    SELECT DATE(createdAt) as d,
           SUM(CAST(json_extract(data, '$.minutes') AS REAL)) as minutes,
           SUM(CAST(json_extract(data, '$.cost') AS REAL)) as cost
    FROM Event
    WHERE type = 'transcribe'
    GROUP BY DATE(createdAt)
    ORDER BY d DESC
    LIMIT 60
  `)) as any as TransRow[];

  const chatPrompt = byModel.reduce((s, r) => s + (r.prompt || 0), 0);
  const chatCompletion = byModel.reduce((s, r) => s + (r.completion || 0), 0);
  const chatCost = costChat(chatPrompt, chatCompletion);

  const embedCost = embedDaily.reduce((s, r) => s + (r.cost || 0), 0);
  const transCost = transDaily.reduce((s, r) => s + (r.cost || 0), 0);
  const totalCost = chatCost.total + embedCost + transCost;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-8 text-neutral-900">
      <h1 className="text-2xl font-semibold">Admin · Usage & cost</h1>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Chat cost">{usd(chatCost.total)}</StatCard>
        <StatCard title="Embeddings cost">{usd(embedCost)}</StatCard>
        <StatCard title="Transcription cost">{usd(transCost)}</StatCard>
        <StatCard title="Total cost" highlight>
          {usd(totalCost)}
        </StatCard>
        <StatCard title="Prompt tokens">{chatPrompt.toLocaleString()}</StatCard>
        <StatCard title="Completion tokens">{chatCompletion.toLocaleString()}</StatCard>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Chat by day (tokens & cost)</h2>
        <DataTable
          headers={["Date", "Prompt", "Completion", "Total", "Cost"]}
          rows={daily.map((r) => {
            const c = costChat(r.prompt ?? 0, r.completion ?? 0);
            return [
              r.d,
              (r.prompt ?? 0).toLocaleString(),
              (r.completion ?? 0).toLocaleString(),
              (r.total ?? 0).toLocaleString(),
              usd(c.total),
            ];
          })}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Embeddings by day</h2>
        <DataTable
          headers={["Date", "Tokens", "Cost"]}
          rows={embedDaily.map((r) => [
            r.d,
            (r.tokens ?? 0).toLocaleString(),
            usd(r.cost ?? 0),
          ])}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Transcription by day</h2>
        <DataTable
          headers={["Date", "Minutes", "Cost"]}
          rows={transDaily.map((r) => [
            r.d,
            (r.minutes ?? 0).toFixed(2),
            usd(r.cost ?? 0),
          ])}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Chat by lesson</h2>
        <DataTable
          headers={["Lesson", "Prompt", "Completion", "Total", "Cost"]}
          rows={byLesson.map((r) => {
            const c = costChat(r.prompt ?? 0, r.completion ?? 0);
            return [
              r.lessonId ?? "-",
              (r.prompt ?? 0).toLocaleString(),
              (r.completion ?? 0).toLocaleString(),
              (r.total ?? 0).toLocaleString(),
              usd(c.total),
            ];
          })}
        />
      </section>
    </main>
  );
}

function StatCard({
  title,
  children,
  highlight = false,
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded border p-4 " +
        (highlight ? "bg-blue-50 border-blue-200" : "bg-white border-neutral-200")
      }
    >
      <div className="text-sm text-neutral-600">{title}</div>
      <div className="text-xl font-semibold mt-1">{children}</div>
    </div>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            {headers.map((h) => (
              <th key={h} className="border px-2 py-1">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx} className="align-top">
              {r.map((c, i) => (
                <td key={i} className="border px-2 py-1 whitespace-pre-wrap">
                  {c as any}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
