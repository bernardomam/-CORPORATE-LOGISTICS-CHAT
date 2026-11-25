import {test} from 'node:test';
import assert from 'node:assert/strict';
import {senhaValida,claimsValidos,chaveJWT} from '../src/utils/authValidation.js';
import {validarPaginacao} from '../src/utils/messagePagination.js';
test('senha respeita limite bcrypt em bytes',()=>{assert.ok(senhaValida('abcdefgh'));assert.ok(!senhaValida('é'.repeat(37)));assert.ok(!senhaValida('curta'));});
test('claims exigem UUID e expiração de até 8 horas',()=>{const c={sub:'00000000-0000-4000-8000-000000000001',iat:1,exp:28801};assert.ok(claimsValidos(c));assert.ok(!claimsValidos({...c,exp:28802}));assert.ok(!claimsValidos({...c,exp:undefined}));assert.ok(!claimsValidos({...c,sub:'x'}));});
test('chave JWT mínima',()=>{const old=process.env.JWT_SECRET;try{process.env.JWT_SECRET='curta';assert.throws(chaveJWT);process.env.JWT_SECRET='x'.repeat(32);assert.equal(chaveJWT().length,32);}finally{if(old===undefined)delete process.env.JWT_SECRET;else process.env.JWT_SECRET=old;}});
test('paginação padrão e limites',()=>{assert.deepEqual(validarPaginacao(),{limit:50,before:null});assert.equal(validarPaginacao({limit:'100'}).limit,100);for(const limit of ['0','101','-1','1.5',['2']])assert.throws(()=>validarPaginacao({limit}),{status:400});assert.throws(()=>validarPaginacao({before:'x'}),{status:400});});
