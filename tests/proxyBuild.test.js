import test from 'node:test';
import assert from 'node:assert/strict';
import { buildUpstreamHeaders } from '../src/proxyBuild.js';

test('drops hop-by-hop and blocks CRLF values', () => {
  const { ok, blocked } = buildUpstreamHeaders([
    { name: 'Host', value: 'api.example.com' },
    { name: 'Connection', value: 'keep-alive, x-debug-trace' },
    { name: 'X-Debug-Trace', value: '1' },
    { name: 'Keep-Alive', value: 'timeout=5' },
    { name: 'X-Forwarded-For', value: '1.2.3.4' },
    { name: 'X-Evil', value: 'ok\r\nHost: evil' },
    { name: 'Content-Type', value: 'application/json' },
  ]);
  assert.equal(ok.Host, 'api.example.com');
  assert.equal(ok['X-Forwarded-For'], '1.2.3.4');
  assert.equal(ok['Content-Type'], 'application/json');
  assert.equal(ok.Connection, undefined);
  assert.equal(ok['Keep-Alive'], undefined);
  assert.equal(ok['X-Debug-Trace'], undefined);
  assert.ok(blocked.some(b => /evil|crlf|CRLF|inject/i.test(b.reason) || b.name === 'X-Evil'));
});

test('later header wins on same name', () => {
  const { ok } = buildUpstreamHeaders([
    { name: 'X-Request-Id', value: 'a' },
    { name: 'X-Request-Id', value: 'b' },
  ]);
  assert.equal(ok['X-Request-Id'], 'b');
});
