import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sessionVersion} from '../src/utils/sessionVersion.js';
test('versão muda com senha e chave',()=>{const a=sessionVersion('hash1','key1');assert.equal(a,sessionVersion('hash1','key1'));assert.notEqual(a,sessionVersion('hash2','key1'));assert.notEqual(a,sessionVersion('hash1','key2'));assert.match(a,/^[a-f0-9]{64}$/);});
