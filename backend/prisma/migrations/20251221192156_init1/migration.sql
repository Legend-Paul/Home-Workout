/*
  Warnings:

  - You are about to drop the column `onboarding` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "onboarding",
ADD COLUMN     "isBoarded" BOOLEAN NOT NULL DEFAULT false;
