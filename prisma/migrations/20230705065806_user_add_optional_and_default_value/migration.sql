-- AlterTable
ALTER TABLE "User" ALTER COLUMN "snsId" DROP NOT NULL,
ALTER COLUMN "isVerified" SET DEFAULT false;
