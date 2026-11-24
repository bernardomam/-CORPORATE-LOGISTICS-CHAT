-- Abort if legacy duplicates exist; do not silently remove historical records.
CREATE UNIQUE INDEX "GroupMember_active_unique" ON "GroupMember" ("groupId","userId") WHERE "leftAt" IS NULL;
CREATE UNIQUE INDEX "ChatRequest_pending_pair_unique" ON "ChatRequest" ("companyId", LEAST("requesterId","requestedUserId"), GREATEST("requesterId","requestedUserId")) WHERE status = 'PENDING';
CREATE TABLE "GroupRequest" (
"id" uuid PRIMARY KEY, "companyId" uuid NOT NULL REFERENCES "Company"(id),
"requesterId" uuid NOT NULL REFERENCES "User"(id), "reviewedById" uuid REFERENCES "User"(id) ON DELETE SET NULL,
"groupId" uuid UNIQUE REFERENCES "Group"(id) ON DELETE SET NULL, name text NOT NULL, "memberIds" uuid[] NOT NULL,
status "ChatRequestStatus" NOT NULL DEFAULT 'PENDING', "createdAt" timestamp(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "reviewedAt" timestamp(3));
CREATE INDEX "GroupRequest_companyId_status_idx" ON "GroupRequest" ("companyId",status);
CREATE UNIQUE INDEX "GroupRequest_pending_name_unique" ON "GroupRequest" ("companyId",lower(name)) WHERE status='PENDING';
ALTER TABLE "GroupRequest" ENABLE ROW LEVEL SECURITY;
GRANT SELECT,INSERT,UPDATE ON "GroupRequest" TO callzup_app;
CREATE POLICY group_request_select ON "GroupRequest" FOR SELECT TO callzup_app USING ("companyId"::text=current_setting('app.company_id',true) AND ("requesterId"::text=current_setting('app.user_id',true) OR EXISTS(SELECT 1 FROM "User" u WHERE u.id::text=current_setting('app.user_id',true) AND u."companyId"="GroupRequest"."companyId" AND u.role='IT_ADMIN' AND u.status='ACTIVE')));
CREATE POLICY group_request_insert ON "GroupRequest" FOR INSERT TO callzup_app WITH CHECK ("companyId"::text=current_setting('app.company_id',true) AND "requesterId"::text=current_setting('app.user_id',true) AND status='PENDING' AND "reviewedById" IS NULL AND "groupId" IS NULL AND "reviewedAt" IS NULL);
CREATE POLICY group_request_update ON "GroupRequest" FOR UPDATE TO callzup_app USING ("companyId"::text=current_setting('app.company_id',true) AND status='PENDING' AND EXISTS(SELECT 1 FROM "User" u WHERE u.id::text=current_setting('app.user_id',true) AND u."companyId"="GroupRequest"."companyId" AND u.role='IT_ADMIN' AND u.status='ACTIVE')) WITH CHECK ("companyId"::text=current_setting('app.company_id',true) AND "reviewedById"::text=current_setting('app.user_id',true) AND status IN ('APPROVED','REJECTED'));
CREATE TABLE "AuthAttempt" (key text PRIMARY KEY,count integer NOT NULL,"expiresAt" timestamp(3) NOT NULL);
CREATE INDEX "AuthAttempt_expiresAt_idx" ON "AuthAttempt" ("expiresAt");
ALTER TABLE "AuthAttempt" ENABLE ROW LEVEL SECURITY;
