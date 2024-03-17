-- CreateTable
CREATE TABLE "StripeVerificationToken" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeVerificationToken_id_key" ON "StripeVerificationToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "StripeVerificationToken_user_id_key" ON "StripeVerificationToken"("user_id");
