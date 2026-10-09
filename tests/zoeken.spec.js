// Zoeken over alles heen (index.html): overzicht per bron met aantallen, lazy geladen aanbieders en partijen, #zoek= deeplink.
const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

test('zoeken: rekentoolnaam geeft groep Rekentools met link naar de juiste rekentool', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html');
  await expect(page.locator('.sitenav-zoek input')).toHaveAttribute('placeholder', 'Zoek op de hele site');
  await expect(page.locator('#search')).toBeHidden();
  await page.fill('.sitenav-zoek input', 'Gewogen rente over leningdelen');
  const groep = page.locator('#zg-rekentools');
  await expect(groep).toBeVisible();
  await expect(groep.locator('h2')).toContainText('Rekentools');
  const link = groep.locator('a', { hasText: 'Gewogen rente over leningdelen' });
  await expect(link).toHaveAttribute('href', 'rekentools.html#rentemix');
  await expect(page.locator('.ook')).toContainText(/Rekentools \([1-9]/);
  await expect(page.locator('#zoek-status')).toContainText(/Rekentools [1-9]/);
  await expect(page).toHaveURL(/#zoek=Gewogen\+rente/);
  expect(fouten).toEqual([]);
});

test('zoeken: aanbieder (ING) en partij (Movir) worden lazy geladen en gelinkt', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html');
  expect(await page.evaluate(() => Array.isArray(window.PARTIJEN))).toBe(false);
  await page.fill('.sitenav-zoek input', 'ING');
  const aanb = page.locator('#zg-aanbieders');
  await expect(aanb).toBeVisible();
  const ing = aanb.locator('li', { has: page.locator('a[href="aanbieders.html#aanbieder-ing"]') });
  await expect(ing).toContainText('Geldverstrekker');
  await expect(ing).toContainText('Voorbeeld');
  await expect(page.locator('#zg-partijen a[href="partijen.html#partij-ing"]')).toBeVisible();
  for (const n of ['Alles', 'Forum', 'Kennisbank', 'FAQ', 'Begrippen', 'Rekentools', 'Hulpmiddelen', 'Aanbieders', 'Partijen'])
    await expect(page.locator('.ook')).toContainText(n + ' (');
  // groepen met meer dan 5 treffers tonen een knop "Toon alle N"
  await expect(page.locator('#zg-forum .q')).toHaveCount(5);
  await expect(page.locator('#zg-forum [data-act="zoek-tab"]')).toContainText(/Toon alle \d+ in Forum/);
  // scripts maar één keer geladen
  expect(await page.evaluate(() => document.querySelectorAll('script[src="data/aanbieders.js"]').length)).toBeLessThanOrEqual(1);

  await page.fill('.sitenav-zoek input', 'Movir');
  const partij = page.locator('#zg-partijen');
  await expect(partij.locator('h2')).toContainText('Partijen');
  await expect(partij.locator('a', { hasText: 'Movir' })).toHaveAttribute('href', 'partijen.html#partij-movir');
  await expect(page.locator('#zg-aanbieders')).toHaveCount(0);
  await partij.locator('a', { hasText: 'Movir' }).click();
  await expect(page).toHaveURL(/partijen\.html#partij-movir$/);
  await expect(page.locator('#partij-movir')).toBeVisible();
  expect(fouten).toEqual([]);
});

test('zoeken: aanbiedersnieuws en "toon alle" binnen een groep', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html');
  await page.fill('.sitenav-zoek input', 'geldverstrekker');
  const aanb = page.locator('#zg-aanbieders');
  await expect(aanb.locator('li')).toHaveCount(5);
  const knop = aanb.locator('[data-act="zoek-meer"]');
  await expect(knop).toContainText(/Toon alle \d+/);
  const n = +(await knop.innerText()).match(/\d+/)[0];
  await knop.click();
  await expect(aanb.locator('li')).toHaveCount(n);
  // nieuwsberichten linken naar hun eigen anker
  const nieuws = await page.evaluate(() => { const a = window.AANBIEDERS.find(x => (x.nieuws || []).length); return { id: a.id, nid: a.nieuws[0].id, titel: a.nieuws[0].titel }; });
  await page.fill('.sitenav-zoek input', nieuws.titel);
  await expect(page.locator(`#zg-aanbieders a[href="aanbieders.html#nieuws-${nieuws.id}-${nieuws.nid}"]`)).toBeVisible();
  expect(fouten).toEqual([]);
});

test('zoeken: #zoek= deeplink toont het overzicht met de nieuwe groepen; niets gevonden-melding', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html#zoek=movir');
  await expect(page.locator('.sitenav-zoek input')).toHaveValue('movir');
  await expect(page.locator('#app h1')).toHaveText('Zoekresultaten');
  await expect(page.locator('#app .sub').first()).toContainText('voor “movir”');
  await expect(page.locator('#zg-partijen a[href="partijen.html#partij-movir"]')).toBeVisible();
  await page.goto('/index.html#zoek=xyzqqq+geen+resultaat');
  await expect(page.locator('#app .empty')).toContainText('Niets gevonden voor “xyzqqq geen resultaat”');
  await expect(page.locator('#app .empty [data-act="meld-zoek"]')).toBeVisible();
  await expect(page.locator('.ook')).toContainText('Partijen (0)');
  // terug naar het forum met een leeg zoekveld
  await page.fill('.sitenav-zoek input', '');
  await expect(page.locator('#app .q').first()).toBeVisible();
  expect(fouten).toEqual([]);
});

test('zoeken: mobiel 390px zonder horizontale scroll, ook bij donkere systeemmodus licht', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/index.html#zoek=hypotheek');
  await expect(page.locator('#zg-aanbieders')).toBeVisible();
  await expect(page.locator('#zg-partijen')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(392);
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(255, 255, 255)');
  expect(fouten).toEqual([]);
});
