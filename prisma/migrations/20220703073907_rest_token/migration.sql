/*
  Warnings:

  - A unique constraint covering the columns `[email_verified_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_email_verified_token_key" ON "User"("email_verified_token");
