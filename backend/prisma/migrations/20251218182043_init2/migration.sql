/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `UserWorkoutExercise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,workoutId,workoutExerciseId]` on the table `UserWorkoutExercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workoutExerciseId` to the `UserWorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserWorkoutExercise" DROP CONSTRAINT "UserWorkoutExercise_exerciseId_fkey";

-- DropIndex
DROP INDEX "UserWorkoutExercise_userId_workoutId_exerciseId_key";

-- AlterTable
ALTER TABLE "UserWorkoutExercise" DROP COLUMN "exerciseId",
ADD COLUMN     "workoutExerciseId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkoutExercise_userId_workoutId_workoutExerciseId_key" ON "UserWorkoutExercise"("userId", "workoutId", "workoutExerciseId");

-- AddForeignKey
ALTER TABLE "UserWorkoutExercise" ADD CONSTRAINT "UserWorkoutExercise_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
