/*
  Warnings:

  - Added the required column `dayOfWeek` to the `UserWorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserWorkoutExercise" ADD COLUMN     "dayOfWeek" INTEGER NOT NULL;
