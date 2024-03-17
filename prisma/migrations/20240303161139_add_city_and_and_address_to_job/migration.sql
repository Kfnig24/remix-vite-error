/*
  Warnings:

  - Added the required column `address` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "hours" INTEGER NOT NULL
);
INSERT INTO "new_Job" ("author", "categorie", "completed", "created_at", "date", "description", "hours", "id", "paid", "title") SELECT "author", "categorie", "completed", "created_at", "date", "description", "hours", "id", "paid", "title" FROM "Job";
DROP TABLE "Job";
ALTER TABLE "new_Job" RENAME TO "Job";
CREATE UNIQUE INDEX "Job_id_key" ON "Job"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
