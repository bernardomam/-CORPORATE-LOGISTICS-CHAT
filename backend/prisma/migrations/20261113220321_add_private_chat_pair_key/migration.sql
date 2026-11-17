-- AlterTable
ALTER TABLE "PrivateChat" ADD COLUMN     "pairKey" VARCHAR(73);

-- CreateIndex
CREATE INDEX "GroupMember_groupId_userId_idx" ON "GroupMember"("groupId", "userId");
