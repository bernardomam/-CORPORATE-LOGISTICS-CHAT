import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { verificarHorarioMensagens } from '../src/middlewares/horarioMensagens.js';
import { verificarHorarioFuncionamento } from '../src/utils/horarioFuncionamento.js';

for (const [hora, permitido] of [
    ['07:59:59', false], ['08:00:00', true], ['12:00:00', true],
    ['17:59:59', true], ['18:00:00', false], ['23:00:00', false]
]) {
    test('HTTP: horário de Brasília ' + hora, async (t) => {
        const data = new Date('2026-11-24T' + hora + '-03:00');
        t.mock.timers.enable({ apis: ['Date'], now: data });
        assert.equal(verificarHorarioFuncionamento(data), permitido);
        const app = express();
        let chamadas = 0;
        app.post('/grupo', verificarHorarioMensagens, (req, res) => {
            chamadas++;
            res.status(201).json({ sucesso: true });
        });
        const server = app.listen(0, '127.0.0.1');
        try {
            await new Promise((resolve, reject) => {
                server.once('listening', resolve);
                server.once('error', reject);
            });
            const resposta = await fetch('http://127.0.0.1:' + server.address().port + '/grupo', { method: 'POST' });
            const body = await resposta.json();
            assert.equal(resposta.status, permitido ? 201 : 403);
            assert.equal(chamadas, permitido ? 1 : 0);
            assert.equal(body.sucesso, permitido);
            if (!permitido) assert.equal(body.codigo, 'FORA_DO_HORARIO');
        } finally {
            await new Promise(resolve => server.close(resolve));
        }
    });
}
