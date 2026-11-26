import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.API_TEST_URL;
const admin = process.env.API_TEST_ADMIN_TOKEN;
const employee = process.env.API_TEST_USER_TOKEN;
const other = process.env.API_TEST_OTHER_COMPANY_TOKEN;
const group = process.env.API_TEST_GROUP_ID;
const chat = process.env.API_TEST_CHAT_ID;
async function request(path, {token,method='GET',body,headers={}}={}) {
    const response = await fetch(new URL(path,base), {method,redirect:'error',signal:AbortSignal.timeout(15000),headers:{...headers,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
    const data=await response.json();
    return {response,data};
}
async function expect(path,status,options) {
    const {response,data}=await request(path,options);
    assert.equal(response.status,status,path);
    assert.equal(data.sucesso,status<400,path);
    return data;
}
test('Servidor e banco disponíveis',{skip:!base},async()=>{
    await expect('/',200); await expect('/api/status',200);
});
for(const path of ['/api/auth/me','/api/users','/api/groups','/api/companies','/api/private-chats','/api/chat-requests']){
    test('Sem JWT: '+path,{skip:!base},()=>expect(path,401));
    test('JWT inválido: '+path,{skip:!base},()=>expect(path,401,{token:'invalid.token.value'}));
}
test('Rota inexistente',{skip:!base},()=>expect('/api/rota-inexistente-teste',404));
test('JSON inválido',{skip:!base},async()=>{
    const r=await fetch(new URL('/api/auth/login',base),{method:'POST',headers:{'Content-Type':'application/json'},body:'{',signal:AbortSignal.timeout(15000)});
    assert.equal(r.status,400);
});
test('Corpo acima do limite',{skip:!base},async()=>{
    const r=await fetch(new URL('/api/auth/login',base),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'x'.repeat(110000)}),signal:AbortSignal.timeout(15000)});
    assert.equal(r.status,413);
});
test('Admin e listagens',{skip:!base||!admin},async()=>{
    const me=await expect('/api/auth/me',200,{token:admin});assert.equal(me.usuario.role,'IT_ADMIN');
    for(const path of ['/api/users','/api/groups','/api/companies'])await expect(path,200,{token:admin});
});
test('Funcionário não acessa administração',{skip:!base||!employee},async()=>{
    const me=await expect('/api/auth/me',200,{token:employee});assert.equal(me.usuario.role,'USER');
    for(const path of ['/api/users','/api/groups','/api/companies','/api/chat-requests'])await expect(path,403,{token:employee});
    await expect('/api/private-chats',200,{token:employee});
});
test('Histórico de grupo e conversa do participante',{skip:!base||!employee||!group||!chat},async()=>{
    await expect('/api/my-groups/'+group,200,{token:employee});
    await expect('/api/group-messages/'+group,200,{token:employee});
    await expect('/api/private-chats/'+chat+'/messages',200,{token:employee});
});
test('Isolamento entre duas empresas',{skip:!base||!employee||!other||!group||!chat},async()=>{
    const a=await expect('/api/auth/me',200,{token:employee});
    const b=await expect('/api/auth/me',200,{token:other});
    assert.notEqual(a.usuario.companyId,b.usuario.companyId);
    await expect('/api/my-groups/'+group,403,{token:other});
    await expect('/api/private-chats/'+chat+'/messages',403,{token:other});
});
