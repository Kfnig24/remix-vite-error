-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "date" DATETIME NOT NULL,
    "hours" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Job_id_key" ON "Job"("id");
