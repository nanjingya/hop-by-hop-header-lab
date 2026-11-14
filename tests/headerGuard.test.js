import test from 'node:test';
import assert from 'node:assert/strict';
import { assertNoCRLF, sanitizeHeaderName, sanitizeHeaderValue } from '../src/headerGuard.js';

test('assertNoCRLF rejects CR LF NUL', () => {
  assert.throws(() => assertNoCRLF('a\rb'));
  assert.throws(() => assertNoCRLF('a\nb'));
  assert.throws(() => assertNoCRLF('a\0b'));
  assert.doesNotThrow(() => assertNoCRLF('abc'));
});

test('sanitizeHeaderName trims and rejects empty/CRLF', () => {
  assert.equal(sanitizeHeaderName('  X-Request-Id  '), 'X-Request-Id');
  assert.throws(() => sanitizeHeaderName(''));
  assert.throws(() => sanitizeHeaderName('X\nEvil'));
});

test('sanitizeHeaderValue rejects CRLF injection', () => {
  assert.equal(sanitizeHeaderValue('ok'), 'ok');
  assert.throws(() => sanitizeHeaderValue('ok\r\nHost: x'));
});
