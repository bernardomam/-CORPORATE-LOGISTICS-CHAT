import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verificarHorarioMensagens } from '../src/middlewares/horarioMensagens.js';
import { verificarHorarioFuncionamento } from '../src/utils/horarioFuncionamento.js';

for (const [hora, permitido] of [
    ['00:00:00', false], ['07:59:59', false], ['08:00:00', true],
    ['12:00:00', true], ['17:59:59', true], ['18:00:00', false],
    ['23:00:00', false]
]) {
    test('Middleware: horário de Brasília ' + hora, (t) => {
        const data = new Date('2026-11-24T' + hora + '-03:00');
        t.mock.timers.enable({ apis: ['Date'], now: data });
        assert.equal(verificarHorarioFuncionamento(data), permitido);
        let chamadas = 0, status, body;
        verificarHorarioMensagens({}, {
            status(n) { status = n; return this; },
            json(b) { body = b; }
        }, () => chamadas++);
        assert.equal(chamadas, permitido ? 1 : 0);
        assert.equal(status, permitido ? undefined : 403);
        if (!permitido) assert.equal(body.codigo, 'FORA_DO_HORARIO');
    });
}
