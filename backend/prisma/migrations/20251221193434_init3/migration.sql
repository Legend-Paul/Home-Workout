/*
  Warnings:

  - You are about to drop the `QUICKSTARTEXERCISE` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "QUICKSTARTEXERCISE" DROP CONSTRAINT "QUICKSTARTEXERCISE_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "QUICKSTARTEXERCISE" DROP CONSTRAINT "QUICKSTARTEXERCISE_quickStartPlanId_fkey";

-- DropTable
DROP TABLE "QUICKSTARTEXERCISE";

-- CreateTable
CREATE TABLE "QuickStartExercise" (
    "id" TEXT NOT NULL,
    "quickStartPlanId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "reps" INTEGER,
    "sets" INTEGER,
    "duration" INTEGER,

    CONSTRAINT "QuickStartExercise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QuickStartExercise_quickStartPlanId_idx" ON "QuickStartExercise"("quickStartPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "QuickStartExercise_quickStartPlanId_exerciseId_key" ON "QuickStartExercise"("quickStartPlanId", "exerciseId");

-- AddForeignKey
ALTER TABLE "QuickStartExercise" ADD CONSTRAINT "QuickStartExercise_quickStartPlanId_fkey" FOREIGN KEY ("quickStartPlanId") REFERENCES "QuickStartPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuickStartExercise" ADD CONSTRAINT "QuickStartExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
