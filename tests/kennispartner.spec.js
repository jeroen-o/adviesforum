// Kennispartner: artikel claimen, badge en vermelding; overzicht woningdata-tools
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { volgFouten } = require('./helpers');

const ROOT = path.join(__dirname, '..');

test('node tools/kennispartners.js --check: badges en data kloppen', () => {
  expect(execFileSync(process.execPath, [path.join(ROOT, 'tools', 'kennispartners.js'), '--check'], { cwd: ROOT, encoding: 'utf8' })).toMatch(/actueel/);
  expect(fs.existsSync(path.join(ROOT, 'badges', 'kennispartner-voorbeeld.svg'))).toBe(true);
});

test('claimpagina: artikel vooraf gekozen, badge volgt de invoer, controle op verplichte velden', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/kennispartner.html?artikel=k352#claimen');
  await expect(page.locator('h1')).toContainText('Kennispartner');
  await expect(page.locator('#kp-zoek')).toHaveValue(/Funderingscijfer/);
  await expect(page.locator('#kp-gekozen a')).toHaveAttribute('href', 'kennisbank/k352.html');
  await page.locator('#kp-naam').fill('Sanne de Vries');
  await expect(page.locator('#claim-voorbeeld svg')).toHaveAttribute('aria-label', /Sanne de Vries/);
  await page.locator('#claim-form button[type="submit"]').click();
  await expect(page.locator('#kp-fout')).toContainText('kantoor');
  await expect(page.locator('#kp-fout')).toContainText('AFM');
  await expect(page.locator('#kp-gelukt')).toBeHidden();
  await expect(page.locator('#partner-lijst')).toContainText('Nog geen Kennispartners');
  await expect(page.locator('.compliance')).toContainText('geen keurmerk');
  expect(fouten).toEqual([]);
});

test('artikel: statische pagina en forumweergave nodigen uit om te claimen', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/kennisbank/k352.html');
  await expect(page.locator('.kennispartner a')).toHaveAttribute('href', '../kennispartner.html?artikel=k352#claimen');
  await page.goto('/index.html#artikel-k350');
  await expect(page.locator('.kennispartner a.btn')).toHaveAttribute('href', 'kennispartner.html?artikel=k350#claimen');
  expect(fouten).toEqual([]);
});

test('woningdata-tools: zeven tools met bronlink en kennisbankartikel', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/woningtools.html');
  const kaarten = page.locator('#tools article');
  await expect(kaarten).toHaveCount(7);
  for (const d of ['woningcijfer.nl', 'pandwise.nl', 'funderingscijfer.nl', 'klimaatcijfer.nl', 'hypotheekcijfer.nl', 'duurzaamheidsprofiel.nl', 'adviseurstools.nl']) {
    await expect(page.locator(`#tools a[href*="${d}"]`)).toHaveAttribute('rel', 'noopener');
  }
  const links = await page.locator('#tools a[href^="kennisbank/"]').evaluateAll(l => l.map(a => a.getAttribute('href')));
  expect(links.length).toBeGreaterThanOrEqual(7);
  for (const l of links) expect(fs.existsSync(path.join(ROOT, l)), l).toBe(true);
  expect(fouten).toEqual([]);
});

test('logo: beeldmerk in menubalk en favicon', async ({ page }) => {
  await page.goto('/voorwaarden.html');
  await expect(page.locator('.sitenav-merk img')).toHaveAttribute('src', 'favicon.svg');
  await expect(page.locator('.sitenav-merk')).toHaveText('Adviesforum');
  expect(fs.readFileSync(path.join(ROOT, 'favicon.svg'), 'utf8')).toContain('clipPath');
});
