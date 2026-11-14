export function bindControls({ engine, els }) {
  const refresh = () => {
    const s = engine.stats();
    els.stats.textContent = `kept=${s.kept} blocked=${s.blocked}`;
    els.preview.textContent = JSON.stringify(engine.last, null, 2);
  };
  els.btnLoad.addEventListener('click', async () => {
    try {
      els.status.textContent = 'loading';
      await engine.load();
      els.log.textContent = `loaded ${engine.raw.length} headers`;
      els.status.textContent = 'ready';
    } catch (e) {
      els.status.textContent = String(e.message || e);
    }
  });
  els.btnRun.addEventListener('click', () => {
    try {
      engine.inspect();
      refresh();
      els.status.textContent = 'ready';
    } catch (e) {
      els.status.textContent = String(e.message || e);
    }
  });
  els.btnExport.addEventListener('click', () => {
    els.preview.textContent = JSON.stringify(engine.last, null, 2);
  });
}
