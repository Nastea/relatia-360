"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { customAlphabet } from "nanoid";

type Msg = { role: "user" | "assistant"; content: string };
type Source = { id: string; score: number; text: string };
type Lesson = { lesson: number; title: string };

type FlowState = "intro" | "teach" | "clarify" | "exercise" | "wrap";

const nano = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 16);

function ensureIds() {
  if (typeof window === "undefined") return { userId: "u_anon", sessionId: "s_temp" };
  let uid = localStorage.getItem("uid");
  if (!uid) {
    uid = `u_${nano()}`;
    localStorage.setItem("uid", uid);
  }
  let sid = localStorage.getItem("sid");
  if (!sid) {
    sid = `s_${nano()}`;
    localStorage.setItem("sid", sid);
  }
  return { userId: uid, sessionId: sid };
}

function ChatPageContent() {
  const search = useSearchParams();
  const router = useRouter();
  const initialLesson = Number(search.get("lesson") || 1);

  const [{ userId, sessionId }, setIds] = useState(ensureIds);
  const [lessonId, setLessonId] = useState<number>(initialLesson);
  const [lesson, setLesson] = useState<Lesson | null>(null);

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sos, setSos] = useState<string | null>(null);
  const [lastSources, setLastSources] = useState<Source[]>([]);
  const [flow, setFlow] = useState<FlowState>("intro");

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Keep the latest user message we just sent (for exercise capture)
  const lastUserMsgRef = useRef<string>("");

  // keep URL in sync with lesson
  useEffect(() => {
    const params = new URLSearchParams(Array.from(search.entries()));
    params.set("lesson", String(lessonId));
    router.replace(`/chat?${params.toString()}`);

    const ids = ensureIds();
    setIds(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs.length]);

  async function maybeSubmitExerciseAnswersIfWrapped(
    serverFlow: FlowState,
    userMessageJustSent: string
  ) {
    // If server advanced to WRAP, we assume the user just sent their exercise answers.
    if (serverFlow === "wrap" && userMessageJustSent.trim().length > 0 && lessonId) {
      try {
        await fetch("/api/exercise/submit", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            userId,
            sessionId,
            lessonId,
            answers: { raw: userMessageJustSent },
          }),
        });
        // You could show a small toast here: "Exercise saved to your report."
      } catch {
        // ignore silently; admin can still see messages if needed
      }
    }
  }

  async function send(message: string) {
    if (!message.trim()) return;
    setBusy(true);
    setError(null);
    setSos(null);
    lastUserMsgRef.current = message;

    setMsgs((m) => [...m, { role: "user", content: message }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, lessonId, userId, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chat failed");

      if (data.sos) setSos(data.sos);
      if (Array.isArray(data.sources)) setLastSources(data.sources);
      if (data.lesson) setLesson({ lesson: data.lesson.lesson, title: data.lesson.title });
      if (data.userId && data.userId !== userId) {
        localStorage.setItem("uid", data.userId);
        setIds((old) => ({ ...old, userId: data.userId }));
      }
      if (data.sessionId && data.sessionId !== sessionId) {
        localStorage.setItem("sid", data.sessionId);
        setIds((old) => ({ ...old, sessionId: data.sessionId }));
      }
      if (data.flowState) setFlow(data.flowState as FlowState);

      setMsgs((m) => [...m, { role: "assistant", content: data.content ?? "" }]);

      // ---- Automatic exercise capture ----
      await maybeSubmitExerciseAnswersIfWrapped(data.flowState as FlowState, message);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  const sourceBadges = useMemo(
    () =>
      lastSources.map((s, i) => (
        <div key={s.id || i} className="rounded border bg-white p-3">
          <div className="text-xs text-neutral-600">#{i + 1} • score {s.score.toFixed(3)}</div>
          <div className="mt-1 text-sm whitespace-pre-wrap">{s.text}</div>
        </div>
      )),
    [lastSources]
  );

  return (
    <main className="mx-auto max-w-3xl min-h-screen flex flex-col bg-white text-neutral-900">
      <header className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Coach chat</h1>
            {lesson && (
              <div className="text-sm text-neutral-600">
                Lesson {lesson.lesson}: {lesson.title}
              </div>
            )}
            <div className="text-xs text-neutral-500">Flow: {flow}</div>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto">
            <label className="text-sm">Lesson</label>
            <select
              value={lessonId}
              onChange={(e) => setLessonId(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>
        </div>

        {sos && (
          <div className="mt-3 bg-red-50 border border-red-200 text-red-800 rounded p-3">
            <b>Safety notice:</b> {sos}
          </div>
        )}

        {error && (
          <div className="mt-3 bg-red-50 text-red-800 border border-red-200 rounded p-3">
            {error}
          </div>
        )}
      </header>

      <section className="flex-1 p-6 space-y-3 overflow-y-auto">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "bg-gray-100 text-neutral-900 rounded p-3"
                : "bg-blue-50 text-neutral-900 rounded p-3"
            }
          >
            <b className="font-semibold">{m.role === "user" ? "You" : "Coach"}</b>
            <div className="whitespace-pre-wrap mt-1">{m.content}</div>
          </div>
        ))}
        <div ref={scrollRef} />
      </section>

      {lastSources.length > 0 && (
        <section className="px-6 pb-4">
          <h2 className="text-lg font-semibold mb-2">Sources used</h2>
          <div className="grid gap-3">{sourceBadges}</div>
        </section>
      )}

      <footer className="border-t p-4 sticky bottom-0 bg-white">
        <div className="space-y-2">
          <textarea
            className="w-full border rounded p-3 min-h-[110px] text-neutral-900 placeholder-neutral-500"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              flow === "exercise"
                ? "Write your exercise answers here…"
                : "Type your message…"
            }
          />
          <div className="flex gap-2">
            <button
              className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
              disabled={!input.trim() || busy}
              onClick={() => {
                const m = input;
                setInput("");
                void send(m);
              }}
            >
              {busy ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
