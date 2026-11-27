import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../dist/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL;

if (!connectionString?.trim()) {
    throw new Error('DATABASE_URL não configurada.');
}

const adapter = new PrismaPg({
    connectionString,
    max: 1,
    idleTimeoutMillis: 3000,
    connectionTimeoutMillis: 10000
});

export const prisma = new PrismaClient({
    adapter
});