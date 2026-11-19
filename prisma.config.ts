import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// A geracao do Prisma Client no build nao precisa conectar ao banco.
// Comandos que usam o banco continuam exigindo uma URL configurada.
const datasourceUrl =
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations'
    },
    ...(datasourceUrl ? { datasource: { url: datasourceUrl } } : {})
});
