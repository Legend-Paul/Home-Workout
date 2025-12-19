/*
  Warnings:

  - You are about to drop the column `workoutId` on the `UserWorkoutExercise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,categoryId,workoutExerciseId]` on the table `UserWorkoutExercise` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `UserWorkoutExercise` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserWorkoutExercise" DROP CONSTRAINT "UserWorkoutExercise_workoutId_fkey";

-- DropIndex
DROP INDEX "UserWorkoutExercise_userId_workoutId_idx";

-- DropIndex
DROP INDEX "UserWorkoutExercise_userId_workoutId_workoutExerciseId_key";

-- AlterTable
ALTER TABLE "UserWorkoutExercise" DROP COLUMN "workoutId",
ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "UserWorkoutExercise_userId_categoryId_dayOfWeek_idx" ON "UserWorkoutExercise"("userId", "categoryId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkoutExercise_userId_categoryId_workoutExerciseId_key" ON "UserWorkoutExercise"("userId", "categoryId", "workoutExerciseId");

-- AddForeignKey
ALTER TABLE "UserWorkoutExercise" ADD CONSTRAINT "UserWorkoutExercise_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
