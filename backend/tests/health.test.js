const { test, after } = require('node:test');
const assert = require('node:assert');
const app = require('../src/app');

test('GET /api/health returns 200 with status ok', async () => {
  const server = app.listen(0);
  after(() => server.close());

  const { port } = server.address();
  const response = await fetch(`http://127.0.0.1:${port}/api/health`);
  const body = await response.json();

  assert.strictEqual(response.status, 200);
  assert.deepStrictEqual(body, { status: 'ok' });
});
