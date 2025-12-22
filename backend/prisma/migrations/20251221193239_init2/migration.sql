/*
  Warnings:

  - You are about to drop the column `muscleGroups` on the `Exercise` table. All the data in the column will be lost.
  - You are about to drop the column `muscleGroups` on the `QuickStartPlan` table. All the data in the column will be lost.
  - You are about to drop the column `muscleGroups` on the `WeeklyPlan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "muscleGroups",
ADD COLUMN     "muscleGroup" TEXT[];

-- AlterTable
ALTER TABLE "QuickStartPlan" DROP COLUMN "muscleGroups",
ADD COLUMN     "muscleGroup" TEXT[];

-- AlterTable
ALTER TABLE "WeeklyPlan" DROP COLUMN "muscleGroups",
ADD COLUMN     "muscleGroup" TEXT[];
