-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Proposition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "teen" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    CONSTRAINT "Proposition_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Proposition" ("accepted", "created_at", "id", "jobId", "teen") SELECT "accepted", "created_at", "id", "jobId", "teen" FROM "Proposition";
DROP TABLE "Proposition";
ALTER TABLE "new_Proposition" RENAME TO "Proposition";
CREATE UNIQUE INDEX "Proposition_id_key" ON "Proposition"("id");
CREATE UNIQUE INDEX "Proposition_teen_jobId_key" ON "Proposition"("teen", "jobId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
