/*
  Warnings:

  - You are about to drop the column `email_verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified_token` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailVerifiedToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_email_verified_token_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "email_verified",
DROP COLUMN "email_verified_token",
ADD COLUMN     "emailVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "emailVerifiedToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerifiedToken_key" ON "User"("emailVerifiedToken");
