import { buildUpstreamHeaders } from './proxyBuild.js';

export class HeaderEngine {
  constructor() {
    this.raw = [];
    this.last = null;
  }
  async load(url = './fixtures/raw-headers.json') {
    const res = await fetch(url);
    this.raw = await res.json();
    return this.raw;
  }
  inspect() {
    this.last = buildUpstreamHeaders(this.raw);
    return this.last;
  }
  stats() {
    const ok = this.last?.ok || {};
    const blocked = this.last?.blocked || [];
    return { kept: Object.keys(ok).length, blocked: blocked.length };
  }
}
