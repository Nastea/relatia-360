-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN "coachScript" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "exercises" JSONB;
ALTER TABLE "Lesson" ADD COLUMN "instructions" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "materialText" TEXT;
