-- CreateTable
CREATE TABLE "Proposition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "teen" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    CONSTRAINT "Proposition_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Proposition_id_key" ON "Proposition"("id");
