import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Gerar o Prisma Client durante o build nao exige conexao com o banco.
// Comandos que acessam o banco devem receber DIRECT_URL ou DATABASE_URL.
const datasourceUrl =
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations'
    },
    ...(datasourceUrl ? { datasource: { url: datasourceUrl } } : {})
});
