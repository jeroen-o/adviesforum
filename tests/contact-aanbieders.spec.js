// Contactgegevens aanbieders: algemene zakelijke kanalen uit data/aanbieders.js, zonder voorbeeldprofielen en zonder persoonsgegevens van voorbeeldprofielen
const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

test('contact aanbieders: lijst, filter op soort, zoeken op naam en telefoonnummer', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/contact-aanbieders.html');
  await expect(page.locator('h1')).toHaveText('Contactgegevens aanbieders');
  const verwacht = await page.evaluate(() => window.AANBIEDERS.filter(a => !/^Voorbeeld /.test(a.naam) && (a.telefoon || a.website || (a.extranet && a.extranet.url))).length);
  const rijen = page.locator('table.contact tbody tr');
  await expect(rijen).toHaveCount(verwacht);
  expect(verwacht).toBeGreaterThan(90);
  await expect(page.locator('table.contact')).not.toContainText('Voorbeeld Hypotheken');
  await expect(page.locator('table.contact a[href^="mailto:"]')).toHaveCount(0);
  await expect(page.locator('#c-rabobank td[data-l="Telefoon"] a')).toHaveAttribute('href', /^tel:\+?\d+$/);
  await expect(page.locator('#c-rabobank td[data-l="Extranet"] a')).toHaveAttribute('href', /^https:\/\//);
  await expect(page.locator('#c-rabobank td[data-l="Bron"]')).toContainText('opgezocht');
  await page.locator('#soorten [data-s="verzekeraar"]').click();
  const nVerz = await page.evaluate(() => window.AANBIEDERS.filter(a => !/^Voorbeeld /.test(a.naam) && a.type === 'verzekeraar' && (a.telefoon || a.website || (a.extranet && a.extranet.url))).length);
  await expect(rijen).toHaveCount(nVerz);
  await page.locator('#soorten [data-s="verzekeraar"]').click();
  await page.locator('#zoek').fill('rabobank');
  await expect(rijen).toHaveCount(1);
  await page.locator('#zoek').fill('088 727');
  await expect(page.locator('#c-rabobank')).toBeVisible();
  await page.locator('#zoek').fill('zzzzgeenaanbieder');
  await expect(page.locator('#lijst')).toContainText('Geen aanbieders');
  expect(fouten).toEqual([]);
});

test('contact aanbieders: aanbiederspagina en menu verwijzen ernaartoe', async ({ page }) => {
  await page.goto('/aanbieders.html');
  await expect(page.locator('#voor-aanbieders a[href="contact-aanbieders.html"]')).toBeVisible();
  await page.goto('/contact-aanbieders.html');
  await expect(page.locator('nav.sitenav a[aria-current="page"]')).toHaveText('Aanbieders');
});
