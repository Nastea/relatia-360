import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MessagesAdmin() {
  const msgs = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      createdAt: true,
      role: true,
      userId: true,
      sessionId: true,
      content: true,
      flagged: true,
      totalTokens: true,
    },
  });

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 text-neutral-900">
      <h1 className="text-2xl font-semibold">Admin · Latest messages</h1>
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border px-2 py-1">Time</th>
            <th className="border px-2 py-1">Role</th>
            <th className="border px-2 py-1">User</th>
            <th className="border px-2 py-1">Session</th>
            <th className="border px-2 py-1">Tokens</th>
            <th className="border px-2 py-1">Flag</th>
            <th className="border px-2 py-1">Content</th>
          </tr>
        </thead>
        <tbody>
          {msgs.map((m) => (
            <tr key={m.id} className="align-top">
              <td className="border px-2 py-1">{new Date(m.createdAt).toLocaleString()}</td>
              <td className="border px-2 py-1">{m.role}</td>
              <td className="border px-2 py-1 font-mono">{m.userId}</td>
              <td className="border px-2 py-1 font-mono">{m.sessionId}</td>
              <td className="border px-2 py-1">{m.totalTokens ?? ""}</td>
              <td className="border px-2 py-1">{m.flagged ? "⚠️" : ""}</td>
              <td className="border px-2 py-1 whitespace-pre-wrap">{m.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
