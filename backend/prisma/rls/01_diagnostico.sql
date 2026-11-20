
-- CALLZUP
-- Diagnóstico de segurança RLS
-- Somente leitura: não altera o banco.

-- 1. Tabelas e configuração RLS
SELECT
    schemaname,
    tablename,
    tableowner,
    rowsecurity AS rls_ativo,
    forcerowsecurity AS rls_forcado
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 2. Políticas existentes
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. Colunas das tabelas
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 4. Chaves estrangeiras
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS tabela_referenciada,
    ccu.column_name AS coluna_referenciada
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.constraint_schema = kcu.constraint_schema
JOIN information_schema.constraint_column_usage ccu
    ON tc.constraint_name = ccu.constraint_name
   AND tc.constraint_schema = ccu.constraint_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 5. Verificar se a função de aplicação já existe
SELECT
    rolname,
    rolcanlogin,
    rolbypassrls,
    rolsuper
FROM pg_roles
WHERE rolname = 'callzup_app';

-- 6. Permissões atuais sobre as tabelas
SELECT
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public'
  AND grantee = 'callzup_app'
ORDER BY table_name, privilege_type;
