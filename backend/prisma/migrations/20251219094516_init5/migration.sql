/*
  Warnings:

  - You are about to drop the column `categoryId` on the `UserWorkoutExercise` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,workoutExerciseId]` on the table `UserWorkoutExercise` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "UserWorkoutExercise" DROP CONSTRAINT "UserWorkoutExercise_categoryId_fkey";

-- DropIndex
DROP INDEX "UserWorkoutExercise_userId_categoryId_dayOfWeek_idx";

-- DropIndex
DROP INDEX "UserWorkoutExercise_userId_categoryId_workoutExerciseId_key";

-- AlterTable
ALTER TABLE "UserWorkoutExercise" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "_CategoryToUserWorkoutExercise" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToUserWorkoutExercise_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToUserWorkoutExercise_B_index" ON "_CategoryToUserWorkoutExercise"("B");

-- CreateIndex
CREATE INDEX "UserWorkoutExercise_userId_dayOfWeek_idx" ON "UserWorkoutExercise"("userId", "dayOfWeek");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkoutExercise_userId_workoutExerciseId_key" ON "UserWorkoutExercise"("userId", "workoutExerciseId");

-- AddForeignKey
ALTER TABLE "_CategoryToUserWorkoutExercise" ADD CONSTRAINT "_CategoryToUserWorkoutExercise_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToUserWorkoutExercise" ADD CONSTRAINT "_CategoryToUserWorkoutExercise_B_fkey" FOREIGN KEY ("B") REFERENCES "UserWorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
