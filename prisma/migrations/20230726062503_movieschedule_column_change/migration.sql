/*
  Warnings:

  - You are about to drop the column `startDate` on the `MovieSchedule` table. All the data in the column will be lost.
  - Changed the type of `startTm` on the `MovieSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `endTm` on the `MovieSchedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "MovieSchedule" DROP COLUMN "startDate",
DROP COLUMN "startTm",
ADD COLUMN     "startTm" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTm",
ADD COLUMN     "endTm" TIMESTAMP(3) NOT NULL;
