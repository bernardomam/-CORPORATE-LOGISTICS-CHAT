
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

dotenv.config({
    path: fileURLToPath(new URL('../../.env', import.meta.url))
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString || !connectionString.trim()) {
    throw new Error(
        'DATABASE_URL não configurada. Verifique as variáveis de ambiente do backend.'
    );
}

const adapter = new PrismaPg({
    connectionString
});

export const prisma = new PrismaClient({
    adapter
});
