/*
  Warnings:

  - You are about to drop the `_CategoryToExercise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CategoryToExercise" DROP CONSTRAINT "_CategoryToExercise_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToExercise" DROP CONSTRAINT "_CategoryToExercise_B_fkey";

-- DropTable
DROP TABLE "_CategoryToExercise";

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
