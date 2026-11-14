const DIRTY = /[\r\n\0]/;

export function assertNoCRLF(s) {
  if (typeof s !== 'string' || DIRTY.test(s)) {
    throw new Error('CRLF/NUL injection detected in header data');
  }
  return s;
}

export function sanitizeHeaderName(name) {
  const trimmed = String(name ?? '').trim();
  if (!trimmed) {
    throw new Error('empty header name');
  }
  assertNoCRLF(trimmed);
  return trimmed;
}

export function sanitizeHeaderValue(value) {
  const v = String(value ?? '');
  assertNoCRLF(v);
  return v;
}
