// Regressietests: uitkomsten moeten blijven kloppen met de bronnen (Nibud-rapport en -Excel).
const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

async function typ(page, sel, waarde) { await page.fill(sel, waarde); await page.dispatchEvent(sel, 'input'); }

test('leennormen: Nibud tabel 2 en 3 en de Excel-rekenhulp', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/leennormen-2026.html');
  await expect(page.locator('#r-max')).toHaveText('€ 199.889');           // 50.000, 4,25%
  await typ(page, '#ink1', '52050');
  await expect(page.locator('#r-max')).toHaveText('€ 208.084');           // met 4,1% loonstijging
  await typ(page, '#ink1', '100000'); await typ(page, '#rente', '5');
  await expect(page.locator('#r-max')).toHaveText('€ 434.657');           // tabel 3
  await typ(page, '#ink1', '29500'); await typ(page, '#rente', '3,5');
  await page.selectOption('#aow', 'ja'); await page.selectOption('#alleen', 'ja');
  await expect(page.locator('#r-max')).toHaveText('€ 127.039');           // Excel-rekenhulp
  expect(fouten).toEqual([]);
});

test('bijleenregeling, overbrugging en maandlasten: standaardvoorbeelden', async ({ page }) => {
  await volgFouten(page);
  await page.goto('/bijleenregeling.html');
  await expect(page.locator('body')).toContainText('€ 144.000,00');
  await expect(page.locator('body')).toContainText('€ 376.000,00');
  await expect(page.locator('body')).toContainText('€ 24.000,00');
  await page.goto('/overbrugging.html');
  await expect(page.locator('body')).toContainText('€ 160.000,00');
  await expect(page.locator('body')).toContainText('€ 800,00');
  await page.goto('/maandlasten.html');
  await expect(page.locator('body')).toContainText('€ 1.432,25');
});

test('oversluiten, kosten koper, LTV en restschuld pensioen: standaardvoorbeelden', async ({ page }) => {
  await volgFouten(page);
  await page.goto('/oversluiten.html');
  await expect(page.locator('body')).toContainText('€ 10.306,87');
  await page.goto('/kosten-koper.html');
  await expect(page.locator('body')).toContainText('€ 394.100');
  await page.goto('/ltv.html');
  await expect(page.locator('body')).toContainText('90,0%');
  await page.goto('/restschuld-pensioen.html');
  await expect(page.locator('body')).toContainText('€ 141.463,18');
});

test('extra aflossen, rentemiddeling, erfpacht en draagplicht: standaardvoorbeelden', async ({ page }) => {
  await volgFouten(page);
  await page.goto('/extra-aflossen.html');
  await expect(page.locator('body')).toContainText('€ 1.214,02');
  await page.goto('/rentemiddeling.html');
  await expect(page.locator('body')).toContainText('4,06');
  await page.goto('/erfpacht.html');
  await expect(page.locator('body')).toContainText('€ 166,67');
  await page.goto('/draagplicht.html');
  await expect(page.locator('a[href^="https://www.draagplicht.nl"]').first()).toBeVisible();
});
