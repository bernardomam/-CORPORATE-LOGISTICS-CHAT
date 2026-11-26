import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { verificarHorarioFuncionamento, verificarAcessoHorario, limiteSessao } from '../src/utils/horarioFuncionamento.js';
import { errorMiddleware } from '../src/middlewares/errorMiddleware.js';

for (const [hora, permitido] of [['10:59:59',false],['11:00:00',true],['15:00:00',true],['20:59:59',true],['21:00:00',false],['23:00:00',false]]) {
    test('Horário UTC '+hora, t => {
        const data = new Date('2026-06-15T'+hora+'Z');
        assert.equal(verificarHorarioFuncionamento(data), permitido);
        t.mock.timers.enable({apis:['Date'],now:data});
        let status, body, next=0;
        verificarAcessoHorario({}, {status(n){status=n;return this},json(b){body=b}},()=>next++);
        assert.equal(next, permitido?1:0);
        if (!permitido) { assert.equal(status,403); assert.equal(body.codigo,'FORA_DO_HORARIO'); }
    });
}
for (const status of [400,401,403,404,409,413,429,500]) {
    test('Erro HTTP '+status, () => {
        let code, body;
        errorMiddleware(Object.assign(new Error('segredo de teste'),{status}),{}, {status(n){code=n;return this},json(b){body=b}},()=>assert.fail('next'));
        assert.equal(code,status); assert.equal(body.sucesso,false); assert.ok(!body.mensagem.includes('segredo de teste'));
    });
}
test('Documentação cobre as rotas declaradas',()=>{
    const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
    const server=read('../src/server.js');
    const doc=read('../docs/API.md');
    const expected=[];
    for(const m of server.matchAll(/app\.get\('([^']+)'/g)) expected.push('GET '+m[1]);
    for(const m of server.matchAll(/app\.use\('([^']+)',\s*(\w+Routes)\)/g)){
        const source=read('../src/routes/'+m[2]+'.js');
        for(const route of source.matchAll(/router\.(get|post|put|patch|delete)\(\s*'([^']+)'/g)){
            expected.push(route[1].toUpperCase()+' '+(m[1]+(route[2]==='/'?'':route[2])).replace(/:(\w+)/g,'{$1}'));
        }
    }
    const documented=[...doc.matchAll(/^### (GET|POST|PUT|PATCH|DELETE) (\S+)$/gm)].map(m=>m[1]+' '+m[2]);
    assert.deepEqual(documented.sort(),expected.sort());
});

for (const [hora, segundos] of [['10:59:59',0],['11:00:00',28800],['20:59:59',1],['21:00:00',0]]) {
 test('Limite de sessão '+hora,()=>assert.equal(limiteSessao(new Date('2026-06-15T'+hora+'Z')),segundos));
}
