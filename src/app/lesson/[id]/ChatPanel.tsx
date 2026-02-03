"use client";

import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

function getOrCreateUID() {
  if (typeof window === "undefined") return "u_anon";
  const key = "pc_uid";
  let v = localStorage.getItem(key);
  if (!v) {
    v = "u_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(key, v);
  }
  return v;
}

export default function ChatPanel({
  lessonId,
  title,
  videoUrl,
}: {
  lessonId: number;
  title: string;
  videoUrl: string | null;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flow, setFlow] = useState<string>("intro");

  const [userId] = useState<string>(() => getOrCreateUID());
  const [sessionId, setSessionId] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Pornește conversația pentru lecția curentă: resetăm starea locală și pornim o sesiune nouă
    setMsgs([]);
    setSessionId(null);
    void send("(start)", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

  async function send(msg: string, isFirst = false) {
    if (!msg.trim()) return;
    setBusy(true);
    setError(null);

    // Afișăm mesajul user-ului doar dacă nu e "(start)"
    if (msg !== "(start)") setMsgs((m) => [...m, { role: "user", content: msg }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          message: msg,
          lessonId,
          userId,
          sessionId: isFirst ? undefined : sessionId ?? undefined, // prima cerere nu trimite sessionId
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat failed");

      // Salvează sessionId-ul întors de server
      if (data.sessionId && !sessionId) {
        setSessionId(String(data.sessionId));
      }

      setMsgs((m) => [...m, { role: "assistant", content: data.content }]);
      if (data.flowState) setFlow(String(data.flowState));
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const m = input;
      setInput("");
      void send(m);
    }
  }

  return (
    <div className="stack gap-4">
      <div className="stack gap-1">
        <h2 className="card-title">Coach chat</h2>
        <p className="tiny muted">
          Lecția {lessonId}: {title}
          {videoUrl ? " · are video" : ""}
        </p>
        <p className="tiny muted">Flow: {flow}</p>
      </div>

      {error && <div className="callout danger">{error}</div>}

      <div ref={listRef} className="h-[520px] overflow-y-auto rounded-xl border p-3">
        <div className="stack gap-3">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "bubble bubble-user" : "bubble bubble-bot"}>
              <div className="tiny muted">{m.role === "user" ? "Tu" : "Coach"}</div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
        </div>
      </div>

      <textarea
        className="min-h-[110px]"
        placeholder="Scrie aici…"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="row gap-2">
        <button
          className="btn btn-primary disabled:opacity-50"
          disabled={busy || !input.trim()}
          onClick={() => {
            const m = input;
            setInput("");
            void send(m);
          }}
        >
          {busy ? "Se trimite…" : "Trimite"}
        </button>
      </div>
    </div>
  );
}
