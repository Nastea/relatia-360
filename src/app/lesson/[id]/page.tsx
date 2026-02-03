// src/app/lesson/[id]/page.tsx
import LessonInfo from "@/app/components/LessonInfo";
import ChatPanel from "@/app/components/ChatPanel";
import { prisma } from "@/lib/db";

interface PageProps {
  // în run-time poate fi Promise<{ id: string }>
  params: { id: string } | Promise<{ id: string }>;
}

export default async function LessonPage({ params }: PageProps) {
  /* 🔑 await params înainte de a-l folosi */
  const { id } = await params;
  const lessonId = Number(id);

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { assets: true },
  });

  if (!lesson) {
    return <p className="p-4">Lecția nu există.</p>;
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 p-6">
      <LessonInfo lesson={lesson as any} />
      <ChatPanel lessonId={lesson.id} />
    </div>
  );
}
