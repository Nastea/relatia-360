"use client";

import { useEffect, useRef, useState } from "react";

/* ---------------------------- tipuri locale ---------------------------- */
type Msg = {
  role: "user" | "assistant";
  content: string;
};

/* --------------------------- utilitare locale -------------------------- */
function getLocalId(key: string, prefix: string) {
  if (typeof window === "undefined") return prefix + "_ssr";
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const id = `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  localStorage.setItem(key, id);
  return id;
}

/* --------------------------- COMPONENTA UI ---------------------------- */
export default function ChatPanel({ lessonId }: { lessonId: number }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [flow, setFlow] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const userId = getLocalId("userId", "u");
  const [sessionId, setSessionId] = useState(
    getLocalId(`s_${lessonId}`, `s${Date.now()}`)
  );

  /* auto-scroll */
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* trimite mesaj */
  async function sendMsg(textOverride?: string) {
    const text = textOverride ?? input.trim();
    if (!text || busy) return;
    if (!textOverride) setInput("");
    if (!textOverride) setMessages((m) => [...m, { role: "user", content: text }]);
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: text, lessonId, userId, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat error");

      setMessages((m) => [...m, { role: "assistant", content: data.content }]);
      setFlow(data.flowState ?? null);

      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId);
        localStorage.setItem(`s_${lessonId}`, data.sessionId);
      }
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Eroare de rețea. Încearcă din nou…" },
      ]);
    } finally {
      setBusy(false);
    }
  }

  /* mesaj inițial automat */
  useEffect(() => {
    if (!started) {
      sendMsg("_start");
      setStarted(true);
    }
  }, [started]);

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto bg-blue-600 text-white rounded px-3 py-2 max-w-[80%]"
                : "mr-auto bg-gray-100 rounded px-3 py-2 max-w-[80%]"
            }
          >
            {m.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {flow && (
        <div className="text-xs text-center text-gray-500 py-1 border-t">
          Flow: {flow}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMsg();
        }}
        className="flex gap-2 border-t p-3"
      >
        <textarea
          className="flex-1 border rounded p-2 h-12 resize-none"
          placeholder="Scrie aici…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMsg();
            }
          }}
          disabled={busy}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={busy || !input.trim()}
        >
          {busy ? "…" : "Trimite"}
        </button>
      </form>
    </div>
  );
}
