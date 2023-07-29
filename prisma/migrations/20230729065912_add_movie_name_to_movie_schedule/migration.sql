/*
  Warnings:

  - Added the required column `movieName` to the `MovieSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MovieSchedule" ADD COLUMN     "movieName" TEXT NOT NULL;
