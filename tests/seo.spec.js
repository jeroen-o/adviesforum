// Zoekmachine-basis: titels, beschrijvingen, canonical, robots en sitemap van de indexeerbare pagina's
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
function html(dir) {
  return fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith('.html')).map(f => path.posix.join(dir, f));
}
const bestanden = [...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')), ...html('kennisbank'), ...html('faq'), ...html('begrippen')];
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');

test('seo: indexeerbare pagina\'s hebben titel, beschrijving zonder weglatingsteken, canonical in de sitemap en een robots-meta', () => {
  const fouten = [];
  let n = 0;
  for (const f of bestanden) {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const kop = t.slice(0, t.indexOf('</head>'));
    if (/<meta name="robots" content="[^"]*noindex/.test(kop)) continue;
    n++;
    const titel = (/<title>([^<]*)<\/title>/.exec(kop) || [])[1];
    const besch = (/<meta name="description" content="([^"]*)"/.exec(kop) || [])[1];
    const canon = (/<link rel="canonical" href="([^"]*)"/.exec(kop) || [])[1];
    if (!titel || titel.length < 15) fouten.push(f + ': titel');
    if (!besch || besch.length < 50) fouten.push(f + ': beschrijving te kort of ontbreekt');
    else {
      if (besch.length > 170) fouten.push(f + ': beschrijving te lang (' + besch.length + ')');
      if (/…$|\.\.\.$/.test(besch)) fouten.push(f + ': beschrijving eindigt op een weglatingsteken');
    }
    if (!canon) fouten.push(f + ': canonical');
    else if (!sitemap.includes('<loc>' + canon + '</loc>') && canon !== 'https://adviesforum.nl/') fouten.push(f + ': canonical niet in sitemap');
    if (!['privacy.html', 'koppelingen.html', '404.html'].includes(f) && !/name="robots" content="index, follow, max-snippet:-1/.test(kop)) fouten.push(f + ': robots-meta');
  }
  expect(n).toBeGreaterThan(300);
  expect(fouten).toEqual([]);
});

test('seo: homepage met sprekende titel en organisatie met raster-logo; robots.txt verwijst naar de sitemap', () => {
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  expect(idx).toContain('<title>Kennisplatform voor financieel adviseurs – Adviesforum</title>');
  expect(idx).toContain('img/icoon-512.png');
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  expect(robots).toContain('Sitemap: https://adviesforum.nl/sitemap.xml');
  expect(robots).not.toMatch(/^Disallow:\s*\/\s*$/m);
  expect(fs.existsSync(path.join(ROOT, 'llms.txt'))).toBe(true);
});
