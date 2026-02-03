/*
  Warnings:

  - You are about to drop the column `videoAsked` on the `Session` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonId" INTEGER,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "flowState" TEXT,
    "videoWatched" BOOLEAN NOT NULL DEFAULT false,
    "videoReflectionDone" BOOLEAN NOT NULL DEFAULT false,
    "exerciseStep" INTEGER NOT NULL DEFAULT 0,
    "clarifyTurns" INTEGER NOT NULL DEFAULT 0,
    "exerciseStarted" BOOLEAN NOT NULL DEFAULT false,
    "exerciseCompleted" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Session_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("clarifyTurns", "exerciseCompleted", "exerciseStarted", "exerciseStep", "flowState", "id", "lessonId", "startedAt", "userId", "videoReflectionDone", "videoWatched") SELECT "clarifyTurns", "exerciseCompleted", "exerciseStarted", "exerciseStep", "flowState", "id", "lessonId", "startedAt", "userId", "videoReflectionDone", "videoWatched" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
