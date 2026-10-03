// Delen op LinkedIn: statische deelpagina's (vraag/<id>.html), de knop in viewVraag en de afscherming na doorklikken.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { volgFouten } = require('./helpers');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://jeroen-o.github.io/adviesforum/';
const meta = (html, prop) => { const m = html.match(new RegExp('<meta property="' + prop + '" content="([^"]*)">')); return m && m[1]; };

// testaccount met bekende code (TEST-CODE-1234), alleen in deze test
const testAccount = page => page.addInitScript(() => {
  Object.defineProperty(window, 'ADVISEURS', { configurable: true, set(v) { v.push({ id: 'ut', naam: 'Test Adviseur', functie: 'Hypotheekadviseur', kantoor: 'Test', rol: 'adviseur', geverifieerd: true, codeHash: 'f92f4f7f69213b390959cf2f9c2bacdc83267e2e6538089342664fb2791927f7' }); this._a = v; }, get() { return this._a; } });
});

test('deelpagina van een bekende vraag heeft de juiste og:title, og:description, og:url en knoppen', () => {
  const html = fs.readFileSync(path.join(ROOT, 'vraag', 'v13.html'), 'utf8');
  expect(meta(html, 'og:title')).toBe('Acceptatie overbruggingskrediet bij herstelde A-codering BKR');
  const d = meta(html, 'og:description');
  expect(d.startsWith('Een doorstromer heeft een herstelde A-codering')).toBe(true);
  expect(d).toMatch(/… · Voorbeeldvraag met 1 voorbeeldantwoord$/);
  expect(d.length).toBeLessThan(260);
  expect(meta(html, 'og:url')).toBe(BASE + 'vraag/v13.html');
  expect(html).toContain('<link rel="canonical" href="' + BASE + 'vraag/v13.html">');
  expect(html).toContain('<title>Acceptatie overbruggingskrediet bij herstelde A-codering BKR – Adviesforum</title>');
  expect(html).toContain('Lees alle antwoorden op het Adviesforum.</b> Inloggen als geverifieerd adviseur vereist.');
  expect(html).toContain('href="../index.html?bron=linkedin#vraag-v13">Inloggen</a>');
  expect(html).toContain('href="../aanmelden.html">Aanmelden</a>');
  expect(html).toContain('<li id="r1">');
  // alleen een fragment van het antwoord, niet de volledige tekst
  expect(html).not.toContain('Leg in het dossier vast');
  expect(fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8')).toContain('<loc>' + BASE + 'vraag/v13.html</loc>');
});

test('knop "Deel op LinkedIn" bij vraag en reactie deelt de statische deelpagina en kopieert een posttekst', async ({ page, context }) => {
  const fouten = await volgFouten(page);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await context.route('https://www.linkedin.com/**', r => r.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }));
  await page.goto('/index.html#vraag-v13');
  const knop = page.locator('.deel-rij [data-act="deel-li"]');
  await expect(knop).toHaveText('Deel op LinkedIn');
  expect(await knop.getAttribute('href')).toBe('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(BASE + 'vraag/v13.html'));
  const reactie = page.locator('.ans [data-act="deel-li"]').first();
  expect(await reactie.getAttribute('href')).toBe('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(BASE + 'vraag/v13.html#r1'));
  const [popup] = await Promise.all([page.waitForEvent('popup'), knop.click()]);
  expect(popup.url()).toContain('linkedin.com/sharing/share-offsite/');
  await expect(page.locator('#toast')).toContainText('Posttekst gekopieerd, plak hem in je LinkedIn-bericht');
  const tekst = await page.evaluate(() => navigator.clipboard.readText());
  expect(tekst.startsWith('Acceptatie overbruggingskrediet bij herstelde A-codering BKR\n\n')).toBe(true);
  expect(tekst).toContain(BASE + 'vraag/v13.html');
  expect(tekst).toContain('Lees de antwoorden op het Adviesforum (inloggen vereist).');
  expect(fouten).toEqual([]);
});

test('via LinkedIn (bron=linkedin), niet ingelogd: afgeschermd blok; na inloggen alles zichtbaar en geen bron in de url', async ({ page }) => {
  const fouten = await volgFouten(page);
  await testAccount(page);
  await page.goto('/index.html?bron=linkedin#vraag-vbj-001');
  await expect(page.locator('.qhead h1')).toContainText('doorlopend krediet');
  await expect(page.locator('#slot-antwoorden')).toContainText('Log in om alle antwoorden te lezen');
  await expect(page.locator('#slot-antwoorden a[href="aanmelden.html"]')).toHaveText('Aanmelden');
  await expect(page.locator('.answers .ans')).toHaveCount(1);
  expect((await page.locator('.answers .ans .body').innerText()).length).toBeLessThan(215);
  expect(page.url()).not.toContain('bron=');
  await page.click('#slot-antwoorden [data-act="inloggen"]');
  await page.fill('#lg-code', 'TEST-CODE-1234');
  await page.click('#f-login button[type="submit"]');
  await expect(page.locator('#who')).toContainText('Test Adviseur');
  await expect(page.locator('#slot-antwoorden')).toHaveCount(0);
  const n = await page.evaluate(() => window.VRAGEN_DATA.find(v => v.id === 'vbj-001').antwoorden.length);
  await expect(page.locator('.answers .ans')).toHaveCount(n);
  // uitloggen: de bron-markering is weg, dus geen afscherming meer
  await page.click('#who [data-act="uitloggen"]');
  await expect(page.locator('#slot-antwoorden')).toHaveCount(0);
  expect(fouten).toEqual([]);
});

test('bron achter de hash werkt ook; zonder bron geen afscherming', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html#vraag-v13&bron=linkedin');
  await expect(page.locator('.qhead h1')).toContainText('A-codering');
  await expect(page.locator('#slot-antwoorden')).toBeVisible();
  expect(page.url()).toMatch(/#vraag-v13$/);
  await page.goto('/index.html');
  await page.goto('/index.html#vraag-v2');
  await page.reload();
  await expect(page.locator('#slot-antwoorden')).toHaveCount(0);
  expect(fouten).toEqual([]);
});

for (const [naam, url] of [['deelpagina', '/vraag/v13.html#r1'], ['afgeschermde vraag', '/index.html?bron=linkedin#vraag-vbj-001'], ['vraag met deelknoppen', '/index.html#vraag-vbj-001']]) {
  test('geen horizontale scroll op 390 px: ' + naam, async ({ page }) => {
    const fouten = await volgFouten(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(url);
    await expect(page.locator('h1').first()).toBeVisible();
    const breed = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(breed).toBeLessThanOrEqual(0);
    expect(fouten).toEqual([]);
  });
}
