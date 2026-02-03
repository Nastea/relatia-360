import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Asset = {
  id: string;
  filename: string;
  path: string;
  mime: string;
  size: number;
};

type LessonListItem = {
  id: number;
  title: string;
  objectives: unknown; // stored as Json in DB; we’ll coerce below
  videoUrl: string | null;
  assets: Asset[];
};

export default async function AdminLessonsListPage() {
  const lessons: LessonListItem[] = await prisma.lesson.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      title: true,
      objectives: true,
      videoUrl: true,
      assets: {
        select: { id: true, filename: true, path: true, mime: true, size: true },
      },
    },
  });

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6 text-neutral-900">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin · Lessons</h1>
        <Link href="/admin/lessons/new" className="rounded bg-black px-4 py-2 text-white">
          New lesson
        </Link>
      </header>

      {lessons.length === 0 ? (
        <div className="rounded border bg-yellow-50 p-4 text-yellow-900">
          No lessons yet. Click <b>New lesson</b> to create one.
        </div>
      ) : (
        <ul className="space-y-4">
          {lessons.map((l: LessonListItem) => {
            const objectivesCount = Array.isArray(l.objectives) ? l.objectives.length : 0;
            return (
              <li key={l.id} className="rounded border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {l.id}. {l.title}
                    </h2>
                    <p className="text-xs text-neutral-500">
                      {objectivesCount} objectives · {l.assets.length} PDFs {l.videoUrl ? " · video" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link className="rounded border px-3 py-2 text-sm" href={`/lesson/${l.id}`}>
                      View
                    </Link>
                    <Link
                      className="rounded bg-black px-3 py-2 text-sm text-white"
                      href={`/admin/lessons/${l.id}`}
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
