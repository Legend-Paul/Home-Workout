/*
  Warnings:

  - You are about to drop the column `workoutId` on the `CalendarEntry` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CalendarEntry" DROP CONSTRAINT "CalendarEntry_workoutId_fkey";

-- AlterTable
ALTER TABLE "CalendarEntry" DROP COLUMN "workoutId",
ADD COLUMN     "workoutExerciseId" TEXT;

-- AddForeignKey
ALTER TABLE "CalendarEntry" ADD CONSTRAINT "CalendarEntry_workoutExerciseId_fkey" FOREIGN KEY ("workoutExerciseId") REFERENCES "WorkoutExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
