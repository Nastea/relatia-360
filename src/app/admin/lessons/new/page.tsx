"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminNewLessonPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [objectives, setObjectives] = useState<string[]>([""]);
  const [videoUrl, setVideoUrl] = useState("");
  const [materialText, setMaterialText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [exercises, setExercises] = useState<{ title: string; prompt: string; rubric?: string }[]>(
    [{ title: "", prompt: "" }]
  );

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function updateObjective(i: number, v: string) {
    setObjectives((arr) => {
      const copy = [...arr];
      copy[i] = v;
      return copy;
    });
  }
  function addObjective() {
    setObjectives((arr) => [...arr, ""]);
  }
  function removeObjective(i: number) {
    setObjectives((arr) => arr.filter((_, idx) => idx !== i));
  }

  function updateExercise(i: number, key: "title" | "prompt" | "rubric", v: string) {
    setExercises((arr) => {
      const copy = [...arr];
      (copy[i] as any)[key] = v;
      return copy;
    });
  }
  function addExercise() {
    setExercises((arr) => [...arr, { title: "", prompt: "" }]);
  }
  function removeExercise(i: number) {
    setExercises((arr) => arr.filter((_, idx) => idx !== i));
  }

  async function createLesson() {
    setBusy(true);
    setErr(null);
    try {
      const payload = {
        title,
        objectives: objectives.filter((x) => x.trim().length),
        videoUrl: videoUrl || null,
        materialText: materialText || null,
        instructions: instructions || null,
        exercises: exercises
          .map((e) => ({ ...e, title: e.title.trim(), prompt: e.prompt.trim() }))
          .filter((e) => e.title || e.prompt),
      };

      if (!payload.title || !payload.objectives.length) {
        throw new Error("Completează titlul și cel puțin un obiectiv.");
      }

      const res = await fetch("/api/lessons", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");
      router.push(`/admin/lessons/${data.lesson.id}`);
    } catch (e: any) {
      setErr(e.message || "Unknown error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6 text-neutral-900">
      <h1 className="text-2xl font-semibold">Admin · New lesson</h1>

      {err && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-800">{err}</div>}

      <section className="space-y-2">
        <label className="text-sm font-medium">Denumire lecție</label>
        <input
          className="w-full rounded border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex: Gând – Emoție – Comportament"
        />
      </section>

      <section className="space-y-3">
        <label className="text-sm font-medium">Obiective</label>
        <div className="space-y-2">
          {objectives.map((o, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="w-full rounded border p-2"
                value={o}
                onChange={(e) => updateObjective(i, e.target.value)}
                placeholder={`Obiectiv ${i + 1}`}
              />
              <button
                className="rounded border px-3 py-2 text-sm"
                onClick={() => removeObjective(i)}
                type="button"
              >
                −
              </button>
            </div>
          ))}
          <button className="rounded border px-3 py-2 text-sm" onClick={addObjective} type="button">
            + Adaugă obiectiv
          </button>
        </div>
      </section>

      <section className="space-y-2">
        <label className="text-sm font-medium">Video (YouTube URL)</label>
        <input
          className="w-full rounded border p-2"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
        />
      </section>

      <section className="space-y-2">
        <label className="text-sm font-medium">Material text</label>
        <textarea
          className="min-h-[180px] w-full rounded border p-2"
          value={materialText}
          onChange={(e) => setMaterialText(e.target.value)}
          placeholder="Conținutul textual integral al lecției…"
        />
      </section>

      <section className="space-y-2">
        <label className="text-sm font-medium">Instrucțiuni pentru predare</label>
        <textarea
          className="min-h-[140px] w-full rounded border p-2"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Ton, limite, aspecte sensibile, cum să formuleze întrebările, etc."
        />
      </section>

      <section className="space-y-3">
        <label className="text-sm font-medium">Exerciții</label>
        <div className="space-y-4">
          {exercises.map((ex, i) => (
            <div key={i} className="rounded border p-3 space-y-2">
              <input
                className="w-full rounded border p-2"
                value={ex.title}
                onChange={(e) => updateExercise(i, "title", e.target.value)}
                placeholder="Titlul exercițiului"
              />
              <textarea
                className="w-full rounded border p-2 min-h-[120px]"
                value={ex.prompt}
                onChange={(e) => updateExercise(i, "prompt", e.target.value)}
                placeholder="Instrucțiunile exercițiului (ce trebuie să răspundă cursantul)"
              />
              <textarea
                className="w-full rounded border p-2 min-h-[80px]"
                value={ex.rubric || ""}
                onChange={(e) => updateExercise(i, "rubric", e.target.value)}
                placeholder="(Opțional) Rubrică / criterii de evaluare"
              />
              <div className="flex gap-2">
                <button
                  className="rounded border px-3 py-2 text-sm"
                  onClick={() => removeExercise(i)}
                  type="button"
                >
                  Elimină
                </button>
              </div>
            </div>
          ))}
          <button className="rounded border px-3 py-2 text-sm" onClick={addExercise} type="button">
            + Adaugă exercițiu
          </button>
        </div>
      </section>

      <div>
        <button
          disabled={busy}
          onClick={createLesson}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {busy ? "Salvez…" : "Creează lecția"}
        </button>
      </div>
    </main>
  );
}
