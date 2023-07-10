/*
  Warnings:

  - Added the required column `startDate` to the `MovieSchedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingSeatsAmt` to the `Screen` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovieSchedule" ADD COLUMN     "startDate" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "remainingSeatsAmt" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "reservationId" TEXT;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
