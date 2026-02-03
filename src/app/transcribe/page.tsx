"use client";
import { useState } from "react";

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleTranscribe() {
    if (!file) return;
    setLoading(true);
    setError(null);
    setText("");

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Transcription failed");
      setText(data.text || "");
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6 text-neutral-900">
      <h1 className="text-2xl font-semibold">Transcribe test</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block"
      />

      <button
        onClick={handleTranscribe}
        disabled={!file || loading}
        className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
      >
        {loading ? "Transcribing…" : "Transcribe"}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      <div className="border rounded p-4 min-h-[120px] whitespace-pre-wrap">
        {text || "Transcript will appear here…"}
      </div>
    </main>
  );
}
