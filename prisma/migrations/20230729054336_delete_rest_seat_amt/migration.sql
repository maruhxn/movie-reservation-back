/*
  Warnings:

  - You are about to alter the column `personAmt` on the `Reservation` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to drop the column `restSeatAmt` on the `Screen` table. All the data in the column will be lost.
  - You are about to alter the column `screenNum` on the `Screen` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `seatAmt` on the `Screen` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - Made the column `movieScheduleId` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_movieScheduleId_fkey";

-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "personAmt" SET DATA TYPE SMALLINT,
ALTER COLUMN "movieScheduleId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Screen" DROP COLUMN "restSeatAmt",
ALTER COLUMN "screenNum" SET DATA TYPE SMALLINT,
ALTER COLUMN "seatAmt" SET DATA TYPE SMALLINT;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_movieScheduleId_fkey" FOREIGN KEY ("movieScheduleId") REFERENCES "MovieSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
