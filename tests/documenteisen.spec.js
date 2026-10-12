// Documenteisen: per document de eisen van NHG en geldverstrekkers met bron, te filteren op situatie en geldverstrekker
const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

test('documenteisen: filteren op situatie, geldverstrekker en zoekterm; elke eis heeft een bron', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/documenteisen.html');
  await expect(page.locator('h1')).toHaveText('Documenteisen');
  const docs = page.locator('#documenten article.doc');
  await expect(docs).toHaveCount(41);
  const eisen = page.locator('#documenten .eisen li');
  expect(await eisen.count()).toBeGreaterThan(100);
  expect(await page.locator('#documenten .eisen li a.bron[href^="https://"]').count()).toBe(await eisen.count());
  await expect(page.locator('#doc-werkgeversverklaring .geldig')).toContainText('Max. 3 maanden');
  await page.locator('#situaties [data-s="ondernemer"]').click();
  await expect(page.locator('#doc-inkomensverklaring-ondernemer')).toContainText('rekenexpert');
  await expect(page.locator('#doc-werkgeversverklaring')).toHaveCount(0);
  await expect(page.locator('#doc-legitimatiebewijs')).toHaveCount(1); /* geldt altijd */
  await page.locator('#situaties [data-s="ondernemer"]').click();
  await expect(docs).toHaveCount(41);
  await page.locator('#gv').selectOption('Lloyds Bank');
  await expect(page.locator('#doc-werkgeversverklaring')).toContainText('Lloyds Bank');
  await expect(page.locator('#doc-werkgeversverklaring')).not.toContainText('Rabobank');
  await page.locator('#gv').selectOption('');
  await page.locator('#zoek').fill('NWWI');
  await expect(page.locator('#teller')).toContainText('document');
  await expect(page.locator('#doc-taxatierapport')).toBeVisible();
  await expect(page.locator('#doc-werkgeversverklaring')).toHaveCount(0);
  expect(fouten).toEqual([]);
});

test('documenteisen: bronnen alleen van geldverstrekkers uit het overzicht, NHG, HDN en overheid', async ({ page }) => {
  await page.goto('/documenteisen.html');
  const hosts = await page.evaluate(() => {
    const out = [];
    window.DOCUMENTEISEN.documenten.forEach(d => d.algemeen.concat(d.gv).forEach(x => out.push({ p: x.p, h: new URL(x.b).hostname.toLowerCase() })));
    return out;
  });
  const verboden = /homefinance|hypotheekcompany|homeinvest|hypotheekvoorwaarden|zelfhypotheekafsluiten|hypotheker\.nl|burovanhoof|hypotheeksupport|hypotheekgo|flexfront/;
  expect(hosts.filter(x => verboden.test(x.h))).toEqual([]);
  const dom = await page.evaluate(() => {
    return fetch('data/voorwaarden-controle.js').then(r => r.text()).then(t => JSON.parse(/EIGEN_DOMEINEN\s*=\s*(\{.*?\});/s.exec(t)[1]));
  });
  const namen = Object.keys(dom);
  const afwijkend = await page.evaluate(({ dom }) => {
    const alias = { 'ASN Bank (Volksbank)': 'ASN Bank', 'MUNT Hypotheken': 'Munt Hypotheken', 'Attens (Achmea)': 'Attens Hypotheken', 'Tulp': 'Tulp Hypotheken' };
    const eigen = ['nhg.nl', 'hdn.nl', 'uwv.nl', 'officielebekendmakingen.nl', 'belastingdienst.nl', 'rijksoverheid.nl'];
    const fouten = [];
    window.DOCUMENTEISEN.documenten.forEach(d => {
      d.algemeen.forEach(x => { const h = new URL(x.b).hostname.toLowerCase(); if (!eigen.some(o => h === o || h.endsWith('.' + o))) fouten.push('algemeen ' + x.p + ' ' + h); });
      d.gv.forEach(x => { const n = alias[x.p] || x.p, h = new URL(x.b).hostname.toLowerCase(); if (!dom[n]) fouten.push('onbekende partij ' + x.p); else if (!dom[n].some(o => h === o || h.endsWith('.' + o)) && !(n === 'bijBouwe' && h.endsWith('prepr.io'))) fouten.push(x.p + ' ' + h); });
    });
    return fouten;
  }, { dom });
  expect(namen.length).toBeGreaterThan(30);
  expect(afwijkend).toEqual([]);
});
