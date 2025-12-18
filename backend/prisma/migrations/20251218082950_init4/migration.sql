-- DropForeignKey
ALTER TABLE "Exercise" DROP CONSTRAINT "Exercise_categoryId_fkey";

-- CreateTable
CREATE TABLE "_CategoryToExercise" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryToExercise_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryToExercise_B_index" ON "_CategoryToExercise"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToExercise" ADD CONSTRAINT "_CategoryToExercise_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToExercise" ADD CONSTRAINT "_CategoryToExercise_B_fkey" FOREIGN KEY ("B") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
