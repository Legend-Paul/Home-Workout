/*
  Warnings:

  - You are about to drop the column `title` on the `Workout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Workout` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Workout_categoryId_title_idx";

-- DropIndex
DROP INDEX "Workout_title_key";

-- AlterTable
ALTER TABLE "Workout" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Workout_name_key" ON "Workout"("name");

-- CreateIndex
CREATE INDEX "Workout_categoryId_name_idx" ON "Workout"("categoryId", "name");
