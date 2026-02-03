"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Asset = {
  id: string;
  filename: string;
  mime: string | null;
  size: number;
  path: string;
};

type Exercise = { title: string; prompt: string; rubric?: string };

type Lesson = {
  id: number;
  title: string;
  objectives: unknown;
  videoUrl: string | null;
  materialText: string | null;
  instructions: string | null;
  coachScript: string | null;
  exercises: unknown;
  assets: Asset[];
};

export default function AdminLessonEditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [objectives, setObjectives] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [materialText, setMaterialText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [coachScript, setCoachScript] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([{ title: "", prompt: "" }]);
  const [assets, setAssets] = useState<Asset[]>([]);

  const [ingestingMat, setIngestingMat] = useState(false);
  const [ingestingPDF, setIngestingPDF] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await fetch(`/api/lessons/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load lesson");
        if (!active) return;
        const l: Lesson = data.lesson;
        setTitle(l.title);
        setVideoUrl(l.videoUrl || "");
        setMaterialText(l.materialText || "");
        setInstructions(l.instructions || "");
        setCoachScript(l.coachScript || "");
        setAssets(l.assets || []);
        setObjectives(Array.isArray(l.objectives) ? (l.objectives as unknown[]).map(String) : []);
        const ex =
          Array.isArray(l.exercises) && l.exercises.length
            ? (l.exercises as unknown[]).map((x) => {
                const obj = x as Record<string, unknown>;
                return {
                  title: String(obj.title || ""),
                  prompt: String(obj.prompt || ""),
                  rubric: obj.rubric ? String(obj.rubric) : undefined,
                };
              })
            : [{ title: "", prompt: "" }];
        setExercises(ex);
      } catch (e: unknown) {
        setErr((e as any)?.message || "Unknown error");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  function setObjective(i: number, v: string) {
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

  function setExercise(i: number, key: "title" | "prompt" | "rubric", v: string) {
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

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        title,
        objectives: objectives.filter((x) => x.trim().length),
        videoUrl: videoUrl || null,
        materialText: materialText || null,
        instructions: instructions || null,
        coachScript: coachScript || null,
        exercises: exercises
          .map((e) => ({ ...e, title: e.title.trim(), prompt: e.prompt.trim() }))
          .filter((e) => e.title || e.prompt),
      };
      if (!payload.title || !payload.objectives.length) {
        throw new Error("Completează titlul și cel puțin un obiectiv.");
      }
      const res = await fetch(`/api/lessons/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Save failed");
      router.refresh();
    } catch (e: unknown) {
      setErr((e as any)?.message || "Unknown error");
    } finally {
      setSaving(false);
    }
  }

  async function uploadPDF(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/lessons/${id}/assets`, { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Upload failed");
    setAssets((a) => [...a, data.asset as Asset]);
  }

  async function ingestMaterial() {
    try {
      setIngestingMat(true);
      const res = await fetch(`/api/lessons/${id}/ingest`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ingest failed");
      alert(`Ingest materialText OK. Fragmente: ${data.count ?? "?"}`);
    } catch (e: unknown) {
      setErr((e as any)?.message || "Ingest error");
    } finally {
      setIngestingMat(false);
    }
  }

  async function ingestPDFs() {
    try {
      setIngestingPDF(true);
      const res = await fetch(`/api/lessons/${id}/ingest/pdf`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Ingest PDFs failed");
      alert(`Ingest PDF OK. Fișiere: ${data.pdfCount}, fragmente: ${data.totalChunks}`);
    } catch (e: unknown) {
      setErr((e as any)?.message || "Ingest PDF error");
    } finally {
      setIngestingPDF(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6 text-neutral-900">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Admin · Edit lesson {id}</h1>
      </header>

      {err && <div className="rounded border border-red-200 bg-red-50 p-3 text-red-800">{err}</div>}
      {loading ? <div>Loading…</div> : null}

      {!loading && (
        <>
          <section className="space-y-2">
            <label className="text-sm font-medium">Denumire lecție</label>
            <input
              className="w-full rounded border p-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </section>

          <section className="space-y-2">
            <label className="text-sm font-medium">Obiective</label>
            <div className="space-y-2">
              {objectives.map((o, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="w-full rounded border p-2"
                    value={o}
                    onChange={(e) => setObjective(i, e.target.value)}
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
            />
          </section>

          <section className="space-y-2">
            <label className="text-sm font-medium">Material text</label>
            <textarea
              className="min-h-[200px] w-full rounded border p-2"
              value={materialText}
              onChange={(e) => setMaterialText(e.target.value)}
              placeholder="Conținut textual integral al lecției…"
            />
          </section>

          <section className="space-y-2">
            <label className="text-sm font-medium">Instrucțiuni pentru predare</label>
            <textarea
              className="min-h-[140px] w-full rounded border p-2"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Ton, limite, disclaimere, cum să pună întrebările, etc."
            />
          </section>

          <section className="space-y-2">
            <label className="text-sm font-medium">Script pentru coach (override)</label>
            <textarea
              className="min-h-[180px] w-full rounded border p-2"
              value={coachScript}
              onChange={(e) => setCoachScript(e.target.value)}
              placeholder="Dacă îl completezi, acest text va înlocui promptul generat automat din câmpurile lecției."
            />
            <p className="text-xs text-neutral-500">
              Recomandat pentru lecții cu structură specială. Lasă gol pentru a folosi promptul generat.
            </p>
          </section>

          <section className="space-y-3">
            <label className="text-sm font-medium">Exerciții</label>
            <div className="space-y-4">
              {exercises.map((ex, i) => (
                <div key={i} className="space-y-2 rounded border p-3">
                  <input
                    className="w-full rounded border p-2"
                    value={ex.title}
                    onChange={(e) => setExercise(i, "title", e.target.value)}
                    placeholder="Titlul exercițiului"
                  />
                  <textarea
                    className="w-full rounded border p-2 min-h-[120px]"
                    value={ex.prompt}
                    onChange={(e) => setExercise(i, "prompt", e.target.value)}
                    placeholder="Instrucțiuni pentru cursant"
                  />
                  <textarea
                    className="w-full rounded border p-2 min-h-[80px]"
                    value={ex.rubric || ""}
                    onChange={(e) => setExercise(i, "rubric", e.target.value)}
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

          <div className="flex flex-wrap gap-3">
            <button
              disabled={saving}
              onClick={save}
              className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            >
              {saving ? "Salvez…" : "Salvează"}
            </button>
            <button
              disabled={ingestingMat}
              onClick={ingestMaterial}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              {ingestingMat ? "Ingest material…" : "Ingest materialText"}
            </button>
            <button
              disabled={ingestingPDF}
              onClick={ingestPDFs}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              {ingestingPDF ? "Ingest PDF-uri…" : "Ingest toate PDF-urile"}
            </button>
          </div>

          <section className="space-y-3 pt-6">
            <h2 className="text-lg font-semibold">PDF pentru descărcare</h2>
           <input
  type="file"
  accept="application/pdf"
onChange={async (e) => {
  const input = e.currentTarget;           // capturează
  const file = input.files?.[0];
  if (!file) return;
  try {
    await uploadPDF(file);
  } catch (error: any) {
    setErr(error.message || "Upload error");
  } finally {
    input.value = "";                      // folosește variabila locală
  }
}}

/>

            {assets.length > 0 ? (
              <ul className="list-disc pl-6">
                {assets.map((a) => (
                  <li key={a.id}>
                    <a className="underline" href={a.path} download>
                      {a.filename}
                    </a>{" "}
                    <span className="text-xs text-neutral-500">
                      ({a.mime} · {a.size.toLocaleString()} bytes)
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-neutral-600">Niciun fișier încă.</p>
            )}
          </section>
        </>
      )}
    </main>
  );
}
