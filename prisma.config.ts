import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma Client generation does not need a database connection.
// Keep the datasource optional during build; database operations still
// require DIRECT_URL or DATABASE_URL to be configured.
const datasourceUrl =
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

export default defineConfig({
    schema: 'prisma/schema.prisma',

    migrations: {
        path: 'prisma/migrations'
    },

    ...(datasourceUrl ? { datasource: { url: datasourceUrl } } : {})
});
