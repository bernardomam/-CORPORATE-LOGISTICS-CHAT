-- CreateEnum
CREATE TYPE "GroupStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "status" "GroupStatus" NOT NULL DEFAULT 'ACTIVE';
