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
