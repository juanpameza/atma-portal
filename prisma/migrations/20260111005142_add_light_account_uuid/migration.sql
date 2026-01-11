/*
  Warnings:

  - A unique constraint covering the columns `[lightAccountUuid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lightAccountUuid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_lightAccountUuid_key" ON "User"("lightAccountUuid");
