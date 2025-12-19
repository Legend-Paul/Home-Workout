/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `UserWorkoutExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserWorkoutExercise_userId_categoryId_workoutExerciseId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkoutExercise_userId_name_key" ON "UserWorkoutExercise"("userId", "name");
