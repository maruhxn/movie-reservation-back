/*
  Warnings:

  - You are about to drop the column `video` on the `Movie` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "video",
ALTER COLUMN "backdrop_path" DROP NOT NULL,
ALTER COLUMN "poster_path" DROP NOT NULL;
