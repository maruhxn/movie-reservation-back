-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" SMALLINT NOT NULL DEFAULT 0;

-- DropEnum
DROP TYPE "RankOldAndNewType";
