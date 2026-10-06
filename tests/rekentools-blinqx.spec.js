// Rekentools van Blinqx (gehost op hypotheekbond.nl): pas laden na een klik, rentetools apart met compliance-melding
const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

async function blokkeerDerden(page) {
  const verzoeken = [];
  await page.route(/hypotheekbond\.nl|hstatic\.nl|werkgeversverklaring\.nl/, route => { verzoeken.push(route.request().url()); return /\.js$/.test(route.request().url()) ? route.fulfill({ status: 200, contentType: 'text/javascript', body: '' }) : route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>tool</title>' }); });
  return verzoeken;
}

test('geen verkeer naar Hypotheekbond tot je een tool opent', async ({ page }) => {
  const fouten = await volgFouten(page);
  const verzoeken = await blokkeerDerden(page);
  await page.goto('/rekentools-blinqx.html');
  await expect(page.locator('h1')).toHaveText('Rekentools van Blinqx');
  await expect(page.locator('.kop p.eigen')).toContainText('accountmanager van Blinqx');
  const n = await page.evaluate(() => window.HYPOTHEEKBOND_TOOLS.reduce((s, g) => s + g.tools.length, 0));
  expect(n).toBe(23);
  await expect(page.locator('article.tool')).toHaveCount(23);
  await expect(page.locator('iframe')).toHaveCount(0);
  expect(verzoeken).toEqual([]);
  const kaart = page.locator('#tool-maxmortgage');
  await kaart.getByRole('button', { name: 'Open tool' }).click();
  const f = kaart.locator('iframe');
  await expect(f).toHaveAttribute('src', 'https://90abc279-e47b-44fa-be93-b69768c31486.tools.hypotheekbond.nl/maxmortgage');
  await expect(f).toHaveAttribute('data-hypotheekbond-tool', 'maxmortgage-iframe');
  await expect(f).toHaveAttribute('referrerpolicy', 'origin');
  await expect(kaart.locator('script[src="https://s.hstatic.nl/js/iframe/iframeResizer.min.js"]')).toHaveCount(1);
  await expect(page).toHaveURL(/#tool=maxmortgage$/);
  await kaart.getByRole('button', { name: 'Sluit tool' }).click();
  await expect(kaart.locator('.vak')).toBeHidden();
  expect(fouten).toEqual([]);
});

test('rentetools staan apart met compliance-melding; oude link met deeplink verwijst door', async ({ page }) => {
  await blokkeerDerden(page);
  await page.goto('/hypotheekbond-tools.html#tool=rente-top-5');
  await expect(page).toHaveURL(/\/rekentools-blinqx\.html#tool=rente-top-5$/);
  await expect(page.locator('#groep-rentes #renteMelding')).toContainText('geen aanbeveling');
  await expect(page.locator('#groep-rentes article.tool')).toHaveCount(6);
  await expect(page.locator('#tool-rente-top-5 iframe')).toHaveAttribute('src', /rente-top-5$/);
  await expect(page.locator('iframe')).toHaveCount(1);
});

test('privacyverklaring noemt de Rekentools van Blinqx en Hypotheekbond', async ({ page }) => {
  await page.goto('/privacy.html');
  await expect(page.locator('#hypotheekbond')).toContainText('pas geladen als je op');
});
