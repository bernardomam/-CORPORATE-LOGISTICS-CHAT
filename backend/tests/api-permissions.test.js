import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = process.env.API_TEST_URL;
const id = '00000000-0000-4000-8000-000000000001';

const doc = readFileSync(
    new URL('../docs/API.md', import.meta.url),
    'utf8'
);

const routes = [...doc.matchAll(
    /^### (GET|POST|PUT|PATCH|DELETE) (\S+)$/gm
)].map(m => [m[1], m[2]]);

const publicRoutes = new Set([
    'GET /',
    'GET /api/status',
    'GET /api/health',
    'POST /api/auth/login'
]);

const avatarRoutes = new Set([
    'PUT /api/users/me/avatar',
    'GET /api/users/{id}/avatar',
    'DELETE /api/users/me/avatar'
]);

function rotaAdministrativa(m, p) {
    if (avatarRoutes.has(m + ' ' + p)) {
        return false;
    }

    return (
        /^\/api\/(companies|departments|groups)(\/|$)/.test(p) ||
        (
            /^\/api\/users(\/|$)/.test(p) &&
            p !== '/api/users/colegas'
        ) ||
        (p === '/api/group-requests' && m === 'GET') ||
        /\/api\/(group-requests|chat-requests)\/\{id\}\/(aprovar|rejeitar)$/.test(p) ||
        (p === '/api/chat-requests' && m === 'GET')
    );
}

test('Fotos documentadas e protegidas por JWT', () => {
    for (const rota of avatarRoutes) {
        assert.ok(routes.some(([m, p]) => m + ' ' + p === rota));
        assert.equal(publicRoutes.has(rota), false);
    }
});

test('Fotos nao exigem perfil administrativo', () => {
    for (const rota of avatarRoutes) {
        const [method, path] = rota.split(' ');
        assert.equal(rotaAdministrativa(method, path), false);
    }

    assert.equal(rotaAdministrativa('GET', '/api/users'), true);
});

for (const [method, path] of routes) {
    if (publicRoutes.has(method + ' ' + path)) continue;

    test('JWT obrigatório: ' + method + ' ' + path, {
        skip: !base
    }, async () => {
        const response = await fetch(
            new URL(path.replace(/\{\w+\}/g, id), base),
            {
                method,
                redirect: 'error',
                signal: AbortSignal.timeout(15000),
                headers: {
                    'Content-Type': 'application/json'
                },
                ...(method === 'GET' ? {} : { body: '{}' })
            }
        );

        assert.equal(response.status, 401);
        assert.equal((await response.json()).sucesso, false);
    });
}

const adminRoutes = routes.filter(
    ([m, p]) => rotaAdministrativa(m, p)
);

for (const [method, path] of adminRoutes) {
    test('Funcionário não administra: ' + method + ' ' + path, {
        skip:
            !base ||
            !process.env.API_TEST_USER_TOKEN ||
            (
                method !== 'GET' &&
                process.env.API_TEST_ALLOW_WRITES !== 'true'
            )
    }, async () => {
        const response = await fetch(
            new URL(path.replace(/\{\w+\}/g, id), base),
            {
                method,
                redirect: 'error',
                signal: AbortSignal.timeout(15000),
                headers: {
                    Authorization: 'Bearer ' + process.env.API_TEST_USER_TOKEN,
                    'Content-Type': 'application/json'
                },
                ...(method === 'GET' ? {} : { body: '{}' })
            }
        );

        assert.equal(response.status, 403);
        assert.equal((await response.json()).sucesso, false);
    });
}

test('Funcionario pode consultar rota de avatar', {
    skip: !base || !process.env.API_TEST_USER_TOKEN
}, async () => {
    const response = await fetch(
        new URL('/api/users/' + id + '/avatar', base),
        {
            headers: {
                Authorization: 'Bearer ' + process.env.API_TEST_USER_TOKEN
            },
            signal: AbortSignal.timeout(15000)
        }
    );

    assert.equal(response.status, 404);
});

test('Bloqueia consulta de avatar de outra empresa', {
    skip:
        !base ||
        !process.env.API_TEST_USER_TOKEN ||
        !process.env.API_TEST_OTHER_COMPANY_USER_ID
}, async () => {
    const response = await fetch(
        new URL(
            '/api/users/' +
            process.env.API_TEST_OTHER_COMPANY_USER_ID +
            '/avatar',
            base
        ),
        {
            headers: {
                Authorization: 'Bearer ' + process.env.API_TEST_USER_TOKEN
            },
            signal: AbortSignal.timeout(15000)
        }
    );

    assert.equal(response.status, 404);
});