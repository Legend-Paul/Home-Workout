/*
  Warnings:

  - Changed the type of `dayName` on the `QuickStartPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `dayName` on the `WeeklyPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "QuickStartPlan" DROP COLUMN "dayName",
ADD COLUMN     "dayName" "Days" NOT NULL;

-- AlterTable
ALTER TABLE "WeeklyPlan" ADD COLUMN     "quickStartPlanId" TEXT,
DROP COLUMN "dayName",
ADD COLUMN     "dayName" "Days" NOT NULL;

-- AddForeignKey
ALTER TABLE "WeeklyPlan" ADD CONSTRAINT "WeeklyPlan_quickStartPlanId_fkey" FOREIGN KEY ("quickStartPlanId") REFERENCES "QuickStartPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
