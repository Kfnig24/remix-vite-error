/*
  Warnings:

  - A unique constraint covering the columns `[teen,pro]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Customer_teen_pro_key" ON "Customer"("teen", "pro");
