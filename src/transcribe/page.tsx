"use client";
import { useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(message: string) {
    if (!message.trim()) return;
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: message }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.content || "" }]);
    } finally {
      setBusy(false);
    }
  }

  async function handleSend() {
    await send(input);
    setInput("");
  }

  async function handleTranscribeAndSend(file: File) {
    const form = new FormData();
    form.append("file", file);
    setBusy(true);
    try {
      const tr = await fetch("/api/transcribe", { method: "POST", body: form });
      const data = await tr.json();
      const transcript: string = data.text || "";
      if (transcript) {
        setMessages((m) => [...m, { role: "user", content: `(voice) ${transcript}` }]);
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ message: transcript }),
        });
        const ans = await res.json();
        setMessages((m) => [...m, { role: "assistant", content: ans.content || "" }]);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Coach chat</h1>

      <div className="space-y-2">
        <textarea
          className="w-full border rounded p-3 min-h-[120px]"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me what's going on…"
        />
        <div className="flex items-center gap-3">
          <button
            onClick={handleSend}
            disabled={!input.trim() || busy}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            Send
          </button>

          <label className="cursor-pointer text-sm underline">
            Upload audio…
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleTranscribeAndSend(f);
              }}
            />
          </label>
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "bg-gray-100 rounded p-3"
                : "bg-blue-50 rounded p-3"
            }
          >
            <b>{m.role === "user" ? "You" : "Coach"}</b>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
