import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const lessons = await prisma.lesson.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      title: true,
      objectives: true,
      videoUrl: true,
      assets: { select: { id: true } },
    },
  });

  return (
    <main className="container space-y-12">
      {/* Hero */}
      <section className="hero">
        <div className="stack gap-6">
          <h1 className="headline">Coach psihologic asistat de AI</h1>
          <p className="muted max-w-2xl">
            Lecții structurate, conversații ghidate și exerciții practice. Fiecare lecție are obiective clare,
            material text, video (opțional) și PDF pentru descărcare. Coach‑ul inițiază dialogul, verifică
            înțelegerea și propune un plan personalizat pe 24h.
          </p>

          <div className="row gap-3">
            <Link href="/lessons" className="btn btn-primary">
              Vezi toate lecțiile
            </Link>
            <Link href="/chat" className="btn btn-outline">
              Începe un chat liber
            </Link>
          </div>
        </div>
      </section>

      {/* Lecții */}
      <section className="stack gap-6">
        <div className="row items-center justify-between">
          <h2 className="title">Lecțiile tale</h2>
          <Link href="/lessons" className="link">
            Pagina lecțiilor →
          </Link>
        </div>

        {lessons.length === 0 ? (
          <div className="callout warn">
            Nu există lecții încă. Intră în <b>Admin</b> și creează prima lecție.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((l) => {
              const objectives =
                Array.isArray(l.objectives) ? (l.objectives as unknown[]).map(String) : [];
              return (
                <li key={l.id} className="card">
                  <div className="stack gap-3">
                    <div className="row items-start justify-between gap-3">
                      <h3 className="card-title">
                        {l.id}. {l.title}
                      </h3>
                    </div>

                    {objectives.length > 0 && (
                      <ul className="list-disc pl-5 text-sm text-neutral-700">
                        {objectives.slice(0, 3).map((o, i) => (
                          <li key={i}>{o}</li>
                        ))}
                        {objectives.length > 3 && <li>…</li>}
                      </ul>
                    )}

                    <div className="row gap-2 pt-2">
                      <Link href={`/lesson/${l.id}`} className="btn btn-soft">
                        Deschide lecția
                      </Link>
                      <Link href={`/chat?lesson=${l.id}`} className="btn btn-primary">
                        Începe chatul
                      </Link>
                    </div>

                    <div className="divider" />

                    <p className="tiny muted">
                      {l.videoUrl ? "Video disponibil" : "Fără video"} · {l.assets.length} PDF
                      {l.assets.length === 1 ? "" : "‑uri"}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Admin */}
      <section className="stack gap-4">
        <h2 className="title">Admin</h2>
        <div className="row gap-3">
          <Link href="/admin/lessons" className="btn btn-outline">
            Admin · Lecții
          </Link>
          <Link href="/admin/usage" className="btn btn-outline">
            Admin · Utilizare
          </Link>
        </div>
        <p className="tiny muted max-w-2xl">
          Din Admin poți crea/edita lecții, încărca PDF‑uri și porni ingest pentru materialele care vor fi
          folosite în RAG (căutare semantică) în timpul conversațiilor.
        </p>
      </section>
    </main>
  );
}
