/*
  Warnings:

  - You are about to drop the column `createdAt` on the `VerificationToken` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "VerificationToken_token_idx";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "createdAt";
