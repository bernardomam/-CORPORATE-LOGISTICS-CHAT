import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base=process.env.API_TEST_URL;
const id='00000000-0000-4000-8000-000000000001';
const doc=readFileSync(new URL('../docs/API.md',import.meta.url),'utf8');
const routes=[...doc.matchAll(/^### (GET|POST|PUT|PATCH|DELETE) (\S+)$/gm)].map(m=>[m[1],m[2]]);
const publicRoutes=new Set(['GET /','GET /api/status','GET /api/health','POST /api/auth/login']);
for(const [method,path] of routes){
 if(publicRoutes.has(method+' '+path))continue;
 test('JWT obrigatório: '+method+' '+path,{skip:!base},async()=>{
 const response=await fetch(new URL(path.replace(/\{\w+\}/g,id),base),{method,redirect:'error',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json'},...(method==='GET'?{}:{body:'{}'})});
 assert.equal(response.status,401);assert.equal((await response.json()).sucesso,false);
 });
}
const adminRoutes=routes.filter(([m,p])=>/^\/api\/(companies|departments|groups)(\/|$)/.test(p)||(/^\/api\/users(\/|$)/.test(p)&&p!=='/api/users/colegas')||(p==='/api/group-requests'&&m==='GET')||(/\/api\/(group-requests|chat-requests)\/\{id\}\/(aprovar|rejeitar)$/.test(p))||(p==='/api/chat-requests'&&m==='GET'));
for(const [method,path] of adminRoutes){
 test('Funcionário não administra: '+method+' '+path,{skip:!base||!process.env.API_TEST_USER_TOKEN},async()=>{
 const response=await fetch(new URL(path.replace(/\{\w+\}/g,id),base),{method,redirect:'error',signal:AbortSignal.timeout(15000),headers:{Authorization:'Bearer '+process.env.API_TEST_USER_TOKEN,'Content-Type':'application/json'},...(method==='GET'?{}:{body:'{}'})});
 assert.equal(response.status,403);assert.equal((await response.json()).sucesso,false);
 });
}
