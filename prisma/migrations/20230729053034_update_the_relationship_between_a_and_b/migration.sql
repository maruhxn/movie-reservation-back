/*
  Warnings:

  - You are about to drop the column `reservationId` on the `Seat` table. All the data in the column will be lost.
  - Made the column `movieId` on table `MovieSchedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `screenId` on table `MovieSchedule` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Reservation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `screenId` on table `Seat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Token` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MovieSchedule" DROP CONSTRAINT "MovieSchedule_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_reservationId_fkey";

-- DropIndex
DROP INDEX "Reservation_id_idx";

-- AlterTable
ALTER TABLE "MovieSchedule" ALTER COLUMN "movieId" SET NOT NULL,
ALTER COLUMN "screenId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "seatIds" TEXT[],
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "reservationId",
ALTER COLUMN "screenId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Token" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Reservation_id_movieScheduleId_seatIds_idx" ON "Reservation"("id", "movieScheduleId", "seatIds");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovieSchedule" ADD CONSTRAINT "MovieSchedule_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
