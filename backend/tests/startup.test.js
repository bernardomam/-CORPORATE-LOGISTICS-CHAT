import test from 'node:test';
import assert from 'node:assert/strict';

test('API initializes and health endpoint responds', async () => {
  process.env.VERCEL = '1';
  process.env.DATABASE_URL = 'postgresql://test:test@127.0.0.1:5432/test';
  const { default: app } = await import('../src/server.js');
  const server = app.listen(0, '127.0.0.1');
  try {
    await new Promise((resolve, reject) => { server.once('listening', resolve); server.once('error', reject); });
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/health`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).sucesso, true);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
