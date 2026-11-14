/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Asset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Asset" ADD COLUMN     "serialNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Asset_serialNumber_key" ON "Asset"("serialNumber");
