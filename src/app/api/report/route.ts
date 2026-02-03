import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return Response.json({ error: "userId required" }, { status: 400 });

  let report = await prisma.report.findUnique({ where: { userId } });
  if (!report) {
    report = await prisma.report.create({ data: { id: `r_${Date.now()}`, userId, data: {} } });
  }
  return Response.json({ report });
}

export async function POST(req: NextRequest) {
  const { userId, patch } = await req.json();
  if (!userId || typeof patch !== "object") {
    return Response.json({ error: "userId and patch required" }, { status: 400 });
  }

  // Merge: read current, shallow-merge at top-level
  const current = await prisma.report.findUnique({ where: { userId } });
  const merged = { ...(current?.data as any), ...patch };

  const report = await prisma.report.upsert({
    where: { userId },
    update: { data: merged },
    create: { id: `r_${Date.now()}`, userId, data: merged },
  });

  return Response.json({ report });
}
