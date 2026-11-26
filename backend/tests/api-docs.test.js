import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    descobrirRotas,
    rotasDocumentadas
} from './routeDiscovery.js';

test('Documentação central cobre todas as operações HTTP', () => {
    assert.deepEqual(
        rotasDocumentadas().sort(),
        descobrirRotas().sort()
    );
});