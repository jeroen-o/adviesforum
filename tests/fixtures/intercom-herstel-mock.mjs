// Nagebootste Intercom voor de test van --herstel: elk kennisbankartikel staat al in een eigen collection.
import fs from 'fs';
import path from 'path';
const ROOT = process.argv[2];
const w = {};
for (const f of ['kennisbank.js', ...fs.readdirSync(path.join(ROOT, 'data')).filter((f) => /^kennisbank-.*\.js$/.test(f)).sort()]) {
  new Function('window', fs.readFileSync(path.join(ROOT, 'data', f), 'utf8') + ';return window')(w);
}
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'intercom-sync.config.json'), 'utf8'));
const arts = w.KENNISBANK.map((a, i) => ({ id: 1000 + i, title: a.titel.replace(/&/g, '&amp;'), parent_id: cfg.collections[a.cat] || cfg.collections.default }));
arts.push({ id: 9, title: 'Artikel van een ander product', parent_id: 1 });
globalThis.fetch = async (url) => {
  const p = +new URL(url).searchParams.get('page');
  return new Response(JSON.stringify({ data: arts.slice((p - 1) * 50, p * 50), pages: { page: p, total_pages: Math.ceil(arts.length / 50) } }), { status: 200 });
};
process.env.INTERCOM_TOKEN = 'test';
process.argv = [process.argv[0], 'sync-intercom.mjs', '--herstel'];
await import(path.join(ROOT, 'scripts', 'sync-intercom.mjs'));
