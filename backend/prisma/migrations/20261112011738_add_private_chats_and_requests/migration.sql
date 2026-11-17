-- CreateEnum
CREATE TYPE "PrivateChatStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "ChatRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "privateChatId" UUID;

-- CreateTable
CREATE TABLE "PrivateChat" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "createdById" UUID NOT NULL,
    "status" "PrivateChatStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrivateChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateChatMember" (
    "id" UUID NOT NULL,
    "privateChatId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrivateChatMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRequest" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "requesterId" UUID NOT NULL,
    "requestedUserId" UUID NOT NULL,
    "reviewedById" UUID,
    "status" "ChatRequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "ChatRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PrivateChat_companyId_status_idx" ON "PrivateChat"("companyId", "status");

-- CreateIndex
CREATE INDEX "PrivateChat_createdById_idx" ON "PrivateChat"("createdById");

-- CreateIndex
CREATE INDEX "PrivateChatMember_userId_idx" ON "PrivateChatMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PrivateChatMember_privateChatId_userId_key" ON "PrivateChatMember"("privateChatId", "userId");

-- CreateIndex
CREATE INDEX "ChatRequest_companyId_status_createdAt_idx" ON "ChatRequest"("companyId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ChatRequest_requesterId_idx" ON "ChatRequest"("requesterId");

-- CreateIndex
CREATE INDEX "ChatRequest_requestedUserId_idx" ON "ChatRequest"("requestedUserId");

-- CreateIndex
CREATE INDEX "Message_privateChatId_createdAt_idx" ON "Message"("privateChatId", "createdAt");

-- AddForeignKey
ALTER TABLE "PrivateChat" ADD CONSTRAINT "PrivateChat_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateChat" ADD CONSTRAINT "PrivateChat_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateChatMember" ADD CONSTRAINT "PrivateChatMember_privateChatId_fkey" FOREIGN KEY ("privateChatId") REFERENCES "PrivateChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateChatMember" ADD CONSTRAINT "PrivateChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRequest" ADD CONSTRAINT "ChatRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRequest" ADD CONSTRAINT "ChatRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRequest" ADD CONSTRAINT "ChatRequest_requestedUserId_fkey" FOREIGN KEY ("requestedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRequest" ADD CONSTRAINT "ChatRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_privateChatId_fkey" FOREIGN KEY ("privateChatId") REFERENCES "PrivateChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
