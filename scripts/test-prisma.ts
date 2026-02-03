// scripts/test-prisma.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const lessons = await prisma.lesson.findMany();
  console.log("Lecții:", lessons);
}

main()
  .catch((e) => {
    console.error("Eroare:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
