/*
  Warnings:

  - You are about to drop the column `actors` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `audiAcc` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `audit` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `directors` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `openDt` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `rankOldAndNew` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `salesAmt` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `showTm` on the `Movie` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Movie` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adult` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backdrop_path` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_language` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_title` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overview` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `popularity` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `poster_path` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `release_date` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `runtime` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `video` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_average` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vote_count` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Movie_name_key";

-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "actors",
DROP COLUMN "audiAcc",
DROP COLUMN "audit",
DROP COLUMN "directors",
DROP COLUMN "name",
DROP COLUMN "openDt",
DROP COLUMN "rank",
DROP COLUMN "rankOldAndNew",
DROP COLUMN "salesAmt",
DROP COLUMN "showTm",
ADD COLUMN     "adult" BOOLEAN NOT NULL,
ADD COLUMN     "backdrop_path" TEXT NOT NULL,
ADD COLUMN     "original_language" TEXT NOT NULL,
ADD COLUMN     "original_title" TEXT NOT NULL,
ADD COLUMN     "overview" TEXT NOT NULL,
ADD COLUMN     "popularity" REAL NOT NULL,
ADD COLUMN     "poster_path" TEXT NOT NULL,
ADD COLUMN     "release_date" TEXT NOT NULL,
ADD COLUMN     "runtime" SMALLINT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "video" BOOLEAN NOT NULL,
ADD COLUMN     "vote_average" REAL NOT NULL,
ADD COLUMN     "vote_count" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Movie_title_key" ON "Movie"("title");
