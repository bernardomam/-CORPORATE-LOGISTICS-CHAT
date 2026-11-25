import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
test('Documentação central cobre todas as operações HTTP',()=>{
 const read=p=>readFileSync(new URL(p,import.meta.url),'utf8');
 const server=read('../src/server.js'),doc=read('../docs/API.md');
 const expected=[...server.matchAll(/app\.get\('([^']+)'/g)].map(m=>'GET '+m[1]);
 for(const m of server.matchAll(/app\.use\('([^']+)',\s*(\w+Routes)\)/g)){
 const source=read('../src/routes/'+m[2]+'.js');
 for(const route of source.matchAll(/router\.(get|post|put|patch|delete)\(\s*'([^']+)'/g))expected.push(route[1].toUpperCase()+' '+(m[1]+(route[2]==='/'?'':route[2])).replace(/:(\w+)/g,'{$1}'));
 }
 const documented=[...doc.matchAll(/^### (GET|POST|PUT|PATCH|DELETE) (\S+)$/gm)].map(m=>m[1]+' '+m[2]);
 assert.deepEqual(documented.sort(),expected.sort());
});
