/*
  Warnings:

  - Made the column `exercises` on table `Lesson` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lesson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "objectives" JSONB NOT NULL,
    "videoUrl" TEXT,
    "materialText" TEXT,
    "instructions" TEXT,
    "exercises" JSONB NOT NULL,
    "coachScript" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Lesson" ("coachScript", "createdAt", "exercises", "id", "instructions", "materialText", "objectives", "title", "videoUrl") SELECT "coachScript", "createdAt", "exercises", "id", "instructions", "materialText", "objectives", "title", "videoUrl" FROM "Lesson";
DROP TABLE "Lesson";
ALTER TABLE "new_Lesson" RENAME TO "Lesson";
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonId" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flowState" TEXT,
    "videoWatched" BOOLEAN NOT NULL DEFAULT false,
    "clarifyTurns" INTEGER NOT NULL DEFAULT 0,
    "exerciseStarted" BOOLEAN NOT NULL DEFAULT false,
    "exerciseCompleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("flowState", "id", "lessonId", "startedAt", "userId", "videoWatched") SELECT "flowState", "id", "lessonId", "startedAt", "userId", "videoWatched" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
