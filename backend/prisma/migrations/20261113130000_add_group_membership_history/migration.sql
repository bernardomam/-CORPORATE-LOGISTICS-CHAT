ALTER TABLE "GroupMember"
ADD COLUMN "leftAt" TIMESTAMP(3);

DROP INDEX "GroupMember_groupId_userId_key";

CREATE UNIQUE INDEX "GroupMember_active_unique"
ON "GroupMember" ("groupId", "userId")
WHERE "leftAt" IS NULL;
