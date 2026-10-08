// Zoekbalk bovenaan elke pagina: doorzoekt de hele site via index.html?zoek=, inclusief alle losse pagina's (data/paginas.js)
const { test, expect } = require('@playwright/test');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

test('node tools/paginas-index.js --check: pagina-index is actueel', () => {
  expect(execFileSync(process.execPath, [path.join(ROOT, 'tools', 'paginas-index.js'), '--check'], { cwd: ROOT, encoding: 'utf8' })).toMatch(/actueel/);
});

test('zoekbalk in de navigatie zoekt vanaf een subpagina op de hele site, ook in losse pagina\'s', async ({ page }) => {
  await page.goto('/overbrugging.html');
  const zoek = page.locator('.sitenav-zoek input[name="zoek"]');
  await expect(zoek).toBeVisible();
  await zoek.fill('herbouwwaarde');
  await zoek.press('Enter');
  await expect(page).toHaveURL(/index\.html#zoek=herbouwwaarde$/);
  await expect(page.locator('#app')).toContainText('Herbouwwaarde');
  await expect(page.locator('#app a[href="herbouwwaarde.html"]').first()).toBeVisible();
});

test('zoekbalk staat ook op gegenereerde pagina\'s en verwijst naar de homepage', async ({ page }) => {
  await page.goto('/faq/');
  await expect(page.locator('.sitenav-zoek')).toHaveAttribute('action', '../index.html');
});
