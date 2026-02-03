/* ---------- src/app/components/LessonInfo.tsx ---------- */
import React from "react";

/* tipuri minime, independente de Prisma */
interface LessonAssetLite {
  id: string;
  filename: string;
  path: string;
}

interface LessonLite {
  id: number;
  title: string;
  objectives?: string[] | null;
  videoUrl?: string | null;
  assets: LessonAssetLite[];
}

/* ------------------------------------------------------- */
export default function LessonInfo({ lesson }: { lesson: LessonLite }) {
  return (
    <div className="space-y-6">
      {/* Titlu */}
      <h1 className="text-2xl font-semibold">{lesson.title}</h1>

      {/* Obiective */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <section>
          <h2 className="font-medium mb-1">Obiective</h2>
          <ul className="list-disc pl-6 space-y-1">
            {lesson.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Video */}
      {lesson.videoUrl && (
        <section>
          <h2 className="font-medium mb-1">Video</h2>
          <a
            href={lesson.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            Deschide pe YouTube
          </a>
        </section>
      )}

      {/* PDF-uri */}
      {lesson.assets.length > 0 && (
        <section>
          <h2 className="font-medium mb-1">Materiale PDF</h2>
          <ul className="list-disc pl-6 space-y-1">
            {lesson.assets.map((a) => (
              <li key={a.id}>
                <a
                  href={a.path}
                  download={a.filename}
                  className="text-blue-600 underline"
                >
                  {a.filename}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
