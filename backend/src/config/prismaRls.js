
import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../dist/generated/prisma/client.js';

/**
 * Cria o cliente Prisma destinado às operações
 * protegidas por Row Level Security (RLS).
 *
 * APP_DATABASE_URL deve utilizar uma função
 * PostgreSQL sem BYPASSRLS e sem propriedade
 * das tabelas protegidas.
 *
 * Esta configuração não substitui a conexão
 * atual até que as políticas e permissões
 * sejam preparadas e testadas.
 */
export function criarPrismaRls() {
    const connectionString = process.env.APP_DATABASE_URL;

    if (
        typeof connectionString !== 'string' ||
        !connectionString.trim()
    ) {
        throw new Error(
            'APP_DATABASE_URL não configurada.'
        );
    }

    if (
        connectionString === process.env.DATABASE_URL ||
        connectionString === process.env.DIRECT_URL
    ) {
        throw new Error(
            'A conexão RLS deve ser diferente das conexões administrativas.'
        );
    }

    const adapter = new PrismaPg({
        connectionString
    });

    return new PrismaClient({
        adapter
    });
}
