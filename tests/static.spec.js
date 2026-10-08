// Statische pagina's voor SEO/GEO (gegenereerd door tools/build-static.js) en 404.html.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { volgFouten } = require('./helpers');

const ROOT = path.join(__dirname, '..');
const lees = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const htmlIn = map => fs.readdirSync(path.join(ROOT, map)).filter(f => f.endsWith('.html')).map(f => map + '/' + f);
const GEGENEREERD = [...htmlIn('kennisbank'), ...htmlIn('faq'), ...htmlIn('begrippen')];

test('node tools/build-static.js --check: gegenereerde bestanden zijn actueel', () => {
  const uit = execFileSync(process.execPath, [path.join(ROOT, 'tools', 'build-static.js'), '--check'], { cwd: ROOT, encoding: 'utf8' });
  expect(uit).toContain('actueel');
});

test('JSON-LD is geldig en elke kennisbankpagina heeft een canonical', () => {
  for (const p of [...GEGENEREERD, '404.html']) {
    const html = lees(p);
    const blokken = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => m[1]);
    if (p !== '404.html') expect(blokken.length, p).toBeGreaterThan(0);
    for (const b of blokken) {
      let obj;
      expect(() => { obj = JSON.parse(b); }, p).not.toThrow();
      expect(obj['@context'], p).toBe('https://schema.org');
    }
    if (p.startsWith('kennisbank/')) {
      const naam = p.slice('kennisbank/'.length);
      const verwacht = 'https://adviesforum.nl/kennisbank/' + (naam === 'index.html' ? '' : naam);
      expect(html, p).toContain('<link rel="canonical" href="' + verwacht + '">');
    }
  }
  expect(GEGENEREERD.filter(p => /^kennisbank\/k/.test(p)).length).toBeGreaterThan(10);
});

test('llms.txt en manifest zijn bruikbaar', () => {
  const llms = lees('llms.txt');
  expect(llms.startsWith('# Adviesforum\n\n> ')).toBe(true);
  expect(llms).toContain('geen klantadvies');
  expect(llms).not.toMatch(/berekenhet/i);
  const m = JSON.parse(lees('manifest.webmanifest'));
  expect(m.theme_color).toBe('#F5A623');
  expect(m.lang).toBe('nl');
});

const kbArtikelen = htmlIn('kennisbank').filter(p => !p.endsWith('index.html')).sort();
const STEEKPROEF = [
  'kennisbank/index.html', kbArtikelen[0], kbArtikelen[kbArtikelen.length - 1],
  'faq/index.html', htmlIn('faq').filter(p => !p.endsWith('index.html')).sort()[0],
  'begrippen/index.html', '404.html'
];

for (const p of STEEKPROEF) {
  test('geen JS-fouten en geen horizontale scroll op 390 px: ' + p, async ({ page }) => {
    const fouten = await volgFouten(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/' + p);
    await expect(page.locator('h1')).toBeVisible();
    const breed = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(breed).toBeLessThanOrEqual(0);
    expect(fouten).toEqual([]);
  });
}
