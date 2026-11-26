import { readFileSync } from 'node:fs';

const read = p => readFileSync(
    new URL(p, import.meta.url),
    'utf8'
);

export function descobrirRotas() {
    const server = read('../src/server.js');

    const expected = [...server.matchAll(
        /app\.get\('([^']+)'/g
    )].map(m => 'GET ' + m[1]);

    function coletar(prefixo, arquivo, visitados = new Set()) {
        if (visitados.has(arquivo)) {
            throw new Error('Importacao circular: ' + arquivo);
        }

        const proximos = new Set(visitados);
        proximos.add(arquivo);

        const source = read('../src/routes/' + arquivo);

        for (const route of source.matchAll(
            /router\.(get|post|put|patch|delete)\(\s*'([^']+)'/g
        )) {
            expected.push(
                route[1].toUpperCase() + ' ' +
                (
                    prefixo +
                    (route[2] === '/' ? '' : route[2])
                ).replace(/:(\w+)/g, '{$1}')
            );
        }

        for (const child of source.matchAll(
            /router\.use\(\s*(\w+Routes)\s*\)/g
        )) {
            coletar(prefixo, child[1] + '.js', proximos);
        }
    }

    for (const m of server.matchAll(
        /app\.use\('([^']+)',\s*(\w+Routes)\)/g
    )) {
        coletar(m[1], m[2] + '.js');
    }

    return expected;
}

export function rotasDocumentadas() {
    const doc = read('../docs/API.md');

    return [...doc.matchAll(
        /^### (GET|POST|PUT|PATCH|DELETE) (\S+)$/gm
    )].map(m => m[1] + ' ' + m[2]);
}