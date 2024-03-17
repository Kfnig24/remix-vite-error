/*
  Warnings:

  - A unique constraint covering the columns `[teen,jobId]` on the table `Proposition` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proposition_teen_jobId_key" ON "Proposition"("teen", "jobId");
