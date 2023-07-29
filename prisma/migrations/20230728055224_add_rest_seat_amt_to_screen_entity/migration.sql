/*
  Warnings:

  - Added the required column `restSeatAmt` to the `Screen` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MovieSchedule" DROP CONSTRAINT "MovieSchedule_screenId_fkey";

-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "restSeatAmt" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "MovieSchedule" ADD CONSTRAINT "MovieSchedule_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;
