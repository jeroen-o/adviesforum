const { test, expect } = require('@playwright/test');
const { PAGINAS, volgFouten } = require('./helpers');

for (const pagina of PAGINAS) {
  test(`${pagina} laadt zonder fouten en past op mobiel`, async ({ page }) => {
    const fouten = await volgFouten(page);
    await page.setViewportSize({ width: 390, height: 900 });
    await page.goto('/' + pagina);
    await expect(page.locator('h1').first()).toBeVisible();
    const breedte = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(breedte).toBeLessThanOrEqual(392);
    expect(fouten).toEqual([]);
  });
}

test('alle interne links en bronnen bestaan', async ({ page, request }) => {
  const fs = require('fs');
  const ontbreekt = [];
  for (const pagina of PAGINAS) {
    const html = fs.readFileSync(pagina, 'utf8');
    const refs = [...html.matchAll(/(?:href|src)="([^"#:?]+)(?:[?#][^"]*)?"/g)].map(m => m[1]).filter(r => r && !r.startsWith('//') && !/[$'+{}]/.test(r));
    for (const r of new Set(refs)) if (!fs.existsSync(r)) ontbreekt.push(`${pagina} → ${r}`);
  }
  // links die in de kennisbankdata staan
  // links in de data en in de lijst met hulpmiddelen
  const bestanden = ['index.html', ...fs.readdirSync('data').filter(f => f.endsWith('.js')).map(f => 'data/' + f)];
  for (const b of bestanden) {
    const tekst = fs.readFileSync(b, 'utf8');
    for (const m of tekst.matchAll(/url:'([^':]+)'/g)) if (!fs.existsSync(m[1].split('#')[0])) ontbreekt.push(`${b} → ${m[1]}`);
  }
  expect(ontbreekt).toEqual([]);
});
