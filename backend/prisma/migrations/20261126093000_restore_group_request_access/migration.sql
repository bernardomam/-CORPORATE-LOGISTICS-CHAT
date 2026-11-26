-- Restore restricted group-request access revoked by the session-security migration.
GRANT SELECT, INSERT ON public."GroupRequest" TO callzup_app;
GRANT UPDATE (status,"reviewedById","reviewedAt","groupId") ON public."GroupRequest" TO callzup_app;
ALTER POLICY group_request_insert ON public."GroupRequest" WITH CHECK (
"companyId"::text=current_setting('app.company_id',true) AND "requesterId"::text=current_setting('app.user_id',true)
AND status='PENDING' AND "reviewedById" IS NULL AND "groupId" IS NULL AND "reviewedAt" IS NULL
AND cardinality("memberIds") BETWEEN 1 AND 500 AND "requesterId"=ANY("memberIds")
AND EXISTS (SELECT 1 FROM public."User" u WHERE u.id="GroupRequest"."requesterId" AND u."companyId"="GroupRequest"."companyId" AND u.status='ACTIVE')
AND EXISTS (SELECT 1 FROM public."Company" c WHERE c.id="GroupRequest"."companyId" AND c.status='ACTIVE')
AND NOT EXISTS (SELECT 1 FROM unnest("memberIds") AS m(id) WHERE NOT EXISTS (SELECT 1 FROM public."User" u WHERE u.id=m.id AND u."companyId"="GroupRequest"."companyId" AND u.status='ACTIVE'))
);
