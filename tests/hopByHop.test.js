import test from 'node:test';
import assert from 'node:assert/strict';
import { isHopByHop } from '../src/hopByHop.js';

test('standard hop-by-hop names', () => {
  for (const n of ['Connection','Keep-Alive','Proxy-Authenticate','Proxy-Authorization','TE','Trailer','Transfer-Encoding','Upgrade']) {
    assert.equal(isHopByHop(n, ''), true);
  }
  assert.equal(isHopByHop('Host', ''), false);
});

test('connection-listed custom headers are hop-by-hop', () => {
  assert.equal(isHopByHop('X-Debug-Trace', 'keep-alive, x-debug-trace'), true);
  assert.equal(isHopByHop('x-debug-trace', 'Keep-Alive, X-Debug-Trace'), true);
  assert.equal(isHopByHop('X-Request-Id', 'keep-alive, x-debug-trace'), false);
});
