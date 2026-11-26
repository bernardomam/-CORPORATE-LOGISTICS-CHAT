import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Prisma Client generation does not require a database connection.
// Keep the datasource optional during builds; migrations still require DIRECT_URL.
const directUrl = process.env.DIRECT_URL;

export default defineConfig({
    schema: 'prisma/schema.prisma',

    migrations: {
        path: 'prisma/migrations'
    },

    ...(directUrl ? { datasource: { url: directUrl } } : {})
});
