// Inhoudelijke consistentie: verboden verwijzingen en bekende fouten mogen niet terugkomen.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
function bestanden(dir, uit = []) {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'tests', 'test-results', 'playwright-report', 'documenten', 'fonts'].includes(f.name)) continue;
    const p = path.join(dir, f.name);
    if (f.isDirectory()) bestanden(p, uit);
    else if (/\.(html|js)$/.test(f.name)) uit.push(p);
  }
  return uit;
}
const ALLE = bestanden(ROOT).map(p => ({ p: path.relative(ROOT, p), t: fs.readFileSync(p, 'utf8') }));

const VERBODEN = [
  { re: /berekenhet/i, why: 'nooit verwijzen naar berekenhet' },
  { re: /localStorage|sessionStorage/, why: 'geen browseropslag (Google Sites-embed)' },
  { re: /BWBR0024281/, why: 'verkeerde wetscode: de Wwft is BWBR0024282' },
  { re: /NHG-kostengrens(?!')/i, why: 'heet sinds 2024 NHG-grens (alleen als zoekterm toegestaan)' },
  { re: /<script[^>]+src=["']https?:/i, why: 'geen externe scripts' },
];

for (const v of VERBODEN) {
  test(`consistentie: ${v.why}`, () => {
    const treffers = ALLE.filter(b => v.re.test(b.t)).map(b => b.p);
    expect(treffers, `${v.why}: ${treffers.join(', ')}`).toEqual([]);
  });
}

test('consistentie: elke pagina heeft een titel op "– Adviesforum" en een meta description', () => {
  const fout = [];
  for (const b of ALLE.filter(b => /\.html$/.test(b.p) && !/beheer-code\.html$/.test(b.p))) {
    if (!/<title>[^<]*– Adviesforum<\/title>/.test(b.t)) fout.push(b.p + ': titel');
    if (!/<meta name="description"/.test(b.t)) fout.push(b.p + ': description');
  }
  expect(fout).toEqual([]);
});

test('consistentie: elke pagina in de paginatests staat in de sitemap of is noindex', () => {
  const { PAGINAS } = require('./helpers');
  const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const fout = PAGINAS.filter(p => {
    const html = fs.readFileSync(path.join(ROOT, p), 'utf8');
    const loc = p === 'index.html' ? '/adviesforum/<' : '/' + p + '<';
    return !sitemap.includes(loc) && !/noindex/.test(html);
  });
  expect(fout).toEqual([]);
});
