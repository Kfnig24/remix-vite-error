-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teen" TEXT NOT NULL,
    "pro" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_id_key" ON "Customer"("id");
