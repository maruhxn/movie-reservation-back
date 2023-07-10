/*
  Warnings:

  - A unique constraint covering the columns `[screenNum]` on the table `Screen` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Screen_screenNum_key" ON "Screen"("screenNum");
