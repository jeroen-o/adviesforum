// Vaste navigatiebalk op alle pagina's en de afbakening tussen overlappende pagina's
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { volgFouten } = require('./helpers');

const ROOT = path.join(__dirname, '..');
const LINKS = ['Home', 'Voorwaarden', 'Hulpmiddelen', 'Laatste nieuws', 'Aanmelden'];

test('node tools/sitenav.js --check: alle pagina\'s hebben de actuele balk', () => {
  expect(execFileSync(process.execPath, [path.join(ROOT, 'tools', 'sitenav.js'), '--check'], { cwd: ROOT, encoding: 'utf8' })).toMatch(/actueel/);
  for (const f of fs.readdirSync(ROOT).filter(f => f.endsWith('.html'))) {
    const t = fs.readFileSync(path.join(ROOT, f), 'utf8');
    expect(t.match(/<nav class="sitenav"/g), f).toHaveLength(1);
    expect(t, f).not.toMatch(/<nav class="balk" aria-label="Forum">/);
  }
});

test('balk heeft overal dezelfde vijf links en markeert de huidige pagina', async ({ page }) => {
  const fouten = await volgFouten(page);
  for (const [url, huidig] of [['/voorwaarden-vergelijker.html', 'Voorwaarden'], ['/laatste.html', 'Laatste nieuws'], ['/orv.html', null], ['/kennisbank/', null]]) {
    await page.goto(url);
    const nav = page.locator('nav.sitenav');
    await expect(nav.locator('ul a')).toHaveText(LINKS);
    await expect(nav).toHaveCSS('background-color', 'rgb(12, 35, 64)');
    if (huidig) await expect(nav.locator('a[aria-current="page"]')).toHaveText(huidig);
    else await expect(nav.locator('a[aria-current="page"]')).toHaveCount(0);
  }
  await page.locator('nav.sitenav a', { hasText: 'Voorwaarden' }).click();
  await expect(page).toHaveURL(/\/voorwaarden\.html$/);
  expect(fouten).toEqual([]);
});

test('balk past op een telefoon zonder horizontaal scrollen', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 700 });
  await page.goto('/voorwaarden.html');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
});

test('acceptatiewijzer en situatiecheck verwijzen naar elkaar', async ({ page }) => {
  await page.goto('/acceptatiewijzer.html#situatie-erfpacht');
  await expect(page.locator('#situatie-erfpacht .naar-sc a')).toHaveAttribute('href', 'situatiecheck.html#s=perfp');
  await page.goto('/situatiecheck.html');
  await expect(page.locator('.sit a.aw').first()).toHaveAttribute('href', /^acceptatiewijzer\.html#situatie-/);
});

test('thema\'s naast elkaar verwijst voor hypotheken naar de vergelijker', async ({ page }) => {
  await page.goto('/vergelijken.html');
  await expect(page.locator('h1')).toHaveText("Aanbiederwegwijzer: thema's naast elkaar");
  await expect(page.locator('#hypMelding a')).toHaveAttribute('href', 'voorwaarden-vergelijker.html');
  await page.locator('#cat').selectOption('schade');
  await expect(page.locator('#hypMelding')).toBeHidden();
});

test('voorwaarden.html legt uit welke pagina waarvoor is', async ({ page }) => {
  await page.goto('/voorwaarden.html#welke');
  const t = page.locator('table.welke');
  await expect(t.locator('tbody tr')).toHaveCount(5);
  await expect(t).toContainText('De aanbieder zelf');
  await expect(t.locator('a[href="partijen.html"]')).toBeVisible();
});
