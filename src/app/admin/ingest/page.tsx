"use client";
import { useState } from "react";

type Result = { ok?: boolean; count?: number; error?: string; filename?: string; tokenEstimate?: number; embedCost?: number };

export default function AdminIngestPage() {
  const [lesson, setLesson] = useState<number>(1);
  const [section, setSection] = useState<string>("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [res, setRes] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<any[]>([]);

  async function uploadText() {
    setBusy(true); setRes(null);
    try {
      const r = await fetch("/api/ingest/text", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, lesson, section }),
      });
      const data = await r.json();
      setRes(data);
    } finally { setBusy(false); }
  }

  async function uploadFile() {
    if (!file) return;
    setBusy(true); setRes(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("lesson", String(lesson));
      form.append("section", section);
      const r = await fetch("/api/ingest/file", { method: "POST", body: form });
      const data = await r.json();
      setRes(data);
    } finally { setBusy(false); }
  }

  async function testQuery() {
    setBusy(true); setHits([]);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: query || "summarize key concepts", lessonId: lesson }),
      });
      const data = await r.json();
      if (Array.isArray(data.sources)) setHits(data.sources);
    } finally { setBusy(false); }
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 text-neutral-900">
      <h1 className="text-2xl font-semibold">Admin · Ingest content</h1>

      <div className="flex flex-wrap gap-3 items-end">
        <label className="flex flex-col">
          <span className="text-sm">Lesson</span>
          <input type="number" value={lesson}
                 onChange={(e) => setLesson(Number(e.target.value))}
                 className="border rounded px-2 py-1 w-28" />
        </label>
        <label className="flex flex-col">
          <span className="text-sm">Section (optional)</span>
          <input value={section}
                 onChange={(e) => setSection(e.target.value)}
                 className="border rounded px-2 py-1 w-60" />
        </label>
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Paste text</h2>
        <textarea
          className="w-full border rounded p-3 min-h-[180px]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste .md/.txt content here…"
        />
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={!text.trim() || busy}
          onClick={uploadText}
        >
          {busy ? "Uploading…" : "Embed pasted text"}
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Upload file (.pdf, .txt, .md)</h2>
        <input
          type="file"
          accept=".pdf,.txt,.md,text/plain,text/markdown,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={!file || busy}
          onClick={uploadFile}
        >
          {busy ? "Uploading…" : "Embed file"}
        </button>
      </section>

      {res && (
        <div className={(res.error ? "bg-red-50 text-red-800 border-red-200" : "bg-green-50 text-green-800 border-green-200") + " border rounded p-3"}>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(res, null, 2)}</pre>
        </div>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Quick verify</h2>
        <input
          className="w-full border rounded px-3 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something that should hit this lesson…"
        />
        <button
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={busy}
          onClick={testQuery}
        >
          {busy ? "Querying…" : "Run test query"}
        </button>

        {hits.length > 0 && (
          <div className="space-y-3 mt-3">
            {hits.map((h, i) => (
              <div key={h.id || i} className="border rounded p-3">
                <div className="text-xs text-neutral-600">
                  #{i + 1} • score {Number(h.score).toFixed(3)}
                </div>
                <div className="mt-1 text-sm whitespace-pre-wrap">{h.text}</div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
