/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Workout_categoryId_idx";

-- CreateIndex
CREATE INDEX "Exercise_categoryId_name_idx" ON "Exercise"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Workout_title_key" ON "Workout"("title");

-- CreateIndex
CREATE INDEX "Workout_categoryId_title_idx" ON "Workout"("categoryId", "title");
