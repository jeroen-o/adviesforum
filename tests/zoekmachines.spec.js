// Uit Google en Bing, wel leesbaar voor andere crawlers (Intercom/Fin): per zoekmachine noindex, geen generieke robots-noindex
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const G = '<meta name="googlebot" content="noindex, follow">';
const B = '<meta name="bingbot" content="noindex, follow">';

test('node tools/zoekmachines.js --check: alle pagina\'s in de hoofdmap hebben de tags', () => {
  expect(execFileSync(process.execPath, [path.join(ROOT, 'tools', 'zoekmachines.js'), '--check'], { cwd: ROOT, encoding: 'utf8' })).toMatch(/actueel/);
});

test('elke pagina (ook gegenereerd) heeft googlebot- en bingbot-noindex in de head, precies één keer', () => {
  const mappen = ['.', 'kennisbank', 'faq', 'begrippen', 'vraag'];
  const fout = [];
  for (const m of mappen) for (const f of fs.readdirSync(path.join(ROOT, m)).filter(f => f.endsWith('.html'))) {
    const t = fs.readFileSync(path.join(ROOT, m, f), 'utf8'), kop = t.slice(0, t.indexOf('</head>'));
    if (kop.split(G).length !== 2 || kop.split(B).length !== 2) fout.push(m + '/' + f);
  }
  expect(fout).toEqual([]);
});

test('sitemap blijft gevuld en robots.txt blokkeert niet alles', () => {
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  expect((sitemap.match(/<loc>/g) || []).length).toBeGreaterThan(300);
  expect(fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8')).not.toMatch(/^Disallow:\s*\/\s*$/m);
});
