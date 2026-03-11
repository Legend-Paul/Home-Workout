/*
  Warnings:

  - Made the column `name` on table `QuickStartWeeklyPlan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "QuickStartWeeklyPlan" ALTER COLUMN "name" SET NOT NULL;
