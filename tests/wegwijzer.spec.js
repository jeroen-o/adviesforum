// Aanbiederwegwijzer (partijen.html): datum laatst bijgewerkt en gecontroleerde voorwaarden uit de voorwaardenvergelijker.
const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

test('meta toont laatst bijgewerkt en de peildata', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/partijen.html');
  await expect(page.locator('#meta')).toContainText('Laatst bijgewerkt: 4 oktober 2026');
  await expect(page.locator('#meta')).toContainText('peildatum kenmerken: 2 oktober 2026');
  await expect(page.locator('.let-op')).toContainText('Peildatum kenmerken: 2 oktober 2026 · voorwaarden online gecontroleerd: 4 oktober 2026');
  expect(fouten).toEqual([]);
});

test('partijkaart toont uitklapbare gecontroleerde voorwaarden met bron en link naar de vergelijker', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/partijen.html');
  const kaart = page.locator('#partij-abn-amro');
  const vw = kaart.locator('details.voorwaarden');
  await expect(vw.locator('summary')).toHaveText('Voorwaarden (gecontroleerd 9 oktober 2026)');
  await expect(vw.locator('li').first()).not.toBeVisible();
  await vw.locator('summary').click();
  await expect(vw.locator('li').first()).toContainText('Boetevrij aflossen:');
  const n = await vw.locator('li').count();
  expect(n).toBeGreaterThan(0);
  expect(n).toBeLessThanOrEqual(8);
  await expect(vw.locator('li a').first()).toHaveText(/^bron: /);
  await expect(vw.locator('li a').first()).toHaveAttribute('href', /^https:\/\//);
  await expect(kaart.locator('.bijgewerkt')).toContainText('voorwaarden gecontroleerd 9 oktober 2026');
  // Partij zonder gecontroleerde voorwaarden: geen sectie
  await expect(page.locator('#partij-movir details.voorwaarden')).toHaveCount(0);
  await expect(page.locator('#partij-movir .bijgewerkt')).not.toContainText('voorwaarden gecontroleerd');
  // Koppeling met afwijkende naam: MUNT Hypotheken ↔ Munt Hypotheken, Dynamic Credit (bijBouwe) ↔ bijBouwe
  await expect(page.locator('#partij-dynamic-credit-bijbouwe details.voorwaarden a', { hasText: 'Vergelijk' })).toHaveAttribute('href', 'voorwaarden-vergelijker.html#vergelijk=bijbouwe');
  await vw.locator('a', { hasText: 'Vergelijk in de voorwaardenvergelijker' }).click();
  await expect(page).toHaveURL(/voorwaarden-vergelijker\.html#vergelijk=abn-amro$/);
  await expect(page.locator('#vergelijking thead th')).toHaveCount(2);
  await expect(page.locator('#vergelijking thead')).toContainText('ABN AMRO');
  expect(fouten).toEqual([]);
});

test('mobiel 390px: voorwaarden passen zonder horizontaal scrollen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/partijen.html#partij-handelsbanken');
  // Via een partijlink klapt de voorwaardensectie van die kaart vanzelf open
  await expect(page.locator('#partij-handelsbanken details.voorwaarden')).toHaveAttribute('open', '');
  const breed = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(breed).toBeLessThanOrEqual(390);
  const kaart = await page.locator('#partij-handelsbanken').boundingBox();
  const det = await page.locator('#partij-handelsbanken details.voorwaarden').boundingBox();
  expect(det.x + det.width).toBeLessThanOrEqual(kaart.x + kaart.width + 1);
});
