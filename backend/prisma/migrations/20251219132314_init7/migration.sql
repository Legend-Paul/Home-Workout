/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `UserWorkoutExercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `UserWorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserWorkoutExercise" ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WorkoutExercise" ALTER COLUMN "order" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkoutExercise_name_key" ON "UserWorkoutExercise"("name");
