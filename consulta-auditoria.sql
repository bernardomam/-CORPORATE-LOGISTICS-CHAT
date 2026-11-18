SELECT
    current_user,
    session_user;

SELECT
    rolname,
    rolsuper,
    rolbypassrls
FROM pg_roles
WHERE rolname = current_user;

SELECT
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
