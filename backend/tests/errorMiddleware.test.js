import { test } from 'node:test';
import assert from 'node:assert/strict';
import { errorMiddleware } from '../src/middlewares/errorMiddleware.js';

for (const status of [400, 401, 403, 404, 409, 413, 415, 429, 500]) {
    test('Erro HTTP ' + status, () => {
        let codigo, body;
        errorMiddleware(Object.assign(new Error('segredo interno'), { status }), {}, {
            status(n) { codigo = n; return this; },
            json(b) { body = b; }
        }, () => assert.fail('next inesperado'));
        assert.equal(codigo, status);
        assert.equal(body.sucesso, false);
        assert.ok(!body.mensagem.includes('segredo interno'));
    });
}
test('Resposta iniciada encaminha erro', () => {
    const erro = new Error('teste');
    let recebido;
    errorMiddleware(erro, {}, { headersSent: true }, e => { recebido = e; });
    assert.equal(recebido, erro);
});
