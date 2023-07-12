/*
  Warnings:

  - You are about to drop the column `screenId` on the `Reservation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_screenId_fkey";

-- DropIndex
DROP INDEX "Reservation_screenId_key";

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "screenId",
ALTER COLUMN "movieScheduleId" DROP NOT NULL;
