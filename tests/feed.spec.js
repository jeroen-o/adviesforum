// RSS-feeds (tools/build-feed.js), favorieten en volgen (functionele cookie af_favorieten), #zoek= en koppelingen.html.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { volgFouten } = require('./helpers');

const ROOT = path.join(__dirname, '..');

test('node tools/build-feed.js --check: feeds zijn actueel', () => {
  const uit = execFileSync(process.execPath, [path.join(ROOT, 'tools', 'build-feed.js'), '--check'], { cwd: ROOT, encoding: 'utf8' });
  expect(uit).toContain('Feeds zijn actueel');
});

test('feed.xml en aanbieders-feed.xml zijn geldige RSS 2.0 (DOMParser)', async ({ page }) => {
  await page.goto('/index.html');
  for (const f of ['feed.xml', 'aanbieders-feed.xml']) {
    const xml = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const r = await page.evaluate(t => {
      const d = new DOMParser().parseFromString(t, 'application/xml');
      const items = [...d.querySelectorAll('channel > item')];
      return {
        fout: d.getElementsByTagName('parsererror').length,
        root: d.documentElement.nodeName, versie: d.documentElement.getAttribute('version'),
        titel: (d.querySelector('channel > title') || {}).textContent || '',
        items: items.length,
        compleet: items.every(i => ['title', 'link', 'guid', 'pubDate', 'description'].every(n => (i.querySelector(n) || {}).textContent)),
        datums: items.every(i => !isNaN(Date.parse(i.querySelector('pubDate').textContent))),
      };
    }, xml);
    expect(r.fout, f + ' is geen geldige XML').toBe(0);
    expect(r.root).toBe('rss');
    expect(r.versie).toBe('2.0');
    expect(r.titel).toContain('Adviesforum');
    expect(r.compleet).toBe(true);
    expect(r.datums).toBe(true);
    if (f === 'feed.xml') { expect(r.items).toBeGreaterThan(0); expect(r.items).toBeLessThanOrEqual(50); }
  }
  // index.html verwijst naar de feeds
  const alt = await page.locator('link[rel="alternate"][type="application/rss+xml"]').evaluateAll(l => l.map(x => x.getAttribute('href')));
  expect(alt).toEqual(expect.arrayContaining(['feed.xml', 'aanbieders-feed.xml']));
  await expect(page.locator('footer a[href="feed.xml"]')).toHaveCount(1);
  await expect(page.locator('footer a[href="aanbieders-feed.xml"]')).toHaveCount(1);
});

test('favorieten: toevoegen, bewaard na herladen (cookie), verwijderen', async ({ page, context }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html#vraag-v13');
  const knop = page.locator('.fav-knop').first();
  await expect(knop).toHaveAttribute('aria-pressed', 'false');
  await knop.click();
  await expect(knop).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/index.html#artikel-k5');
  await page.locator('.fav-knop').first().click();

  const cookie = (await context.cookies()).find(c => c.name === 'af_favorieten');
  expect(cookie, 'functionele cookie af_favorieten').toBeTruthy();
  expect(decodeURIComponent(cookie.value)).toContain('v.v13');
  expect(cookie.value.length).toBeLessThan(3500);
  expect(cookie.sameSite).toBe('Lax');
  expect((await context.cookies()).some(c => /^af_/.test(c.name) && c.name !== 'af_favorieten')).toBe(false);

  await page.reload();
  await expect(page.locator('.fav-knop').first()).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/index.html#favorieten');
  await expect(page.locator('#fav-lijst li')).toHaveCount(2);
  await expect(page.locator('#fav-lijst a[href="#vraag-v13"]')).toHaveCount(1);
  await expect(page.locator('.notice', { hasText: 'Functionele cookie' })).toBeVisible();

  // verwijderen vanaf de favorietenpagina
  await page.locator('#fav-lijst li[data-fav="v.v13"] .fav-knop').click();
  await expect(page.locator('#fav-lijst li')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('#fav-lijst li')).toHaveCount(1);
  await expect(page.locator('#fav-lijst a[href="#artikel-k5"]')).toHaveCount(1);
  expect(fouten).toEqual([]);
});

test('favorieten: exportlink herstelt favorieten en gevolgde categorieën', async ({ page, browser }) => {
  await page.goto('/index.html#vraag-v13');
  await page.locator('.fav-knop').first().click();
  await page.goto('/index.html#favorieten');
  await page.locator('[data-act="volg"][data-soort="f"][data-cat="hyp"]').click();
  const link = await page.inputValue('#fav-export');
  expect(link).toMatch(/#favorieten=v\.v13&volgen=f\.hyp$/);

  const ander = await browser.newContext({ baseURL: 'http://127.0.0.1:4173' });
  const p2 = await ander.newPage();
  const fouten = await volgFouten(p2);
  await p2.goto(link.replace(/^https?:\/\/[^/]+/, ''));
  await expect(p2.locator('#fav-lijst a[href="#vraag-v13"]')).toHaveCount(1);
  await expect(p2.locator('[data-act="volg"][data-soort="f"][data-cat="hyp"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(p2).toHaveURL(/#favorieten$/);
  const c = (await ander.cookies()).find(x => x.name === 'af_favorieten');
  expect(decodeURIComponent(c.value)).toContain('v.v13');
  // forumstartpagina toont het blok "Nieuw in wat je volgt"
  await p2.goto('/index.html');
  await expect(p2.locator('#volg-blok h2')).toHaveText('Nieuw in wat je volgt');
  expect(fouten).toEqual([]);
  await ander.close();
});

test('volgen: blok toont items sinds het vorige bezoek uit de cookie', async ({ page, context }) => {
  // vorig bezoek 1 januari 2000, laatst actief lang geleden: alles in Hypotheken is nieuw
  await context.addCookies([{ name: 'af_favorieten', value: encodeURIComponent('1~~f.hyp~946684800~946684800~'), url: 'http://127.0.0.1:4173/' }]);
  await page.goto('/index.html');
  await expect(page.locator('#volg-blok li').first()).toBeVisible();
  await expect(page.locator('#volg-blok .sub').first()).toContainText('Sinds je vorige bezoek');
  // het nieuwe bezoek schuift het tijdstip op
  const c = (await context.cookies()).find(x => x.name === 'af_favorieten');
  const d = decodeURIComponent(c.value).split('~');
  expect(+d[4]).toBeGreaterThan(946684800);
});

test('#zoek= vult de zoekbalk en filtert', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html#zoek=overbruggingskrediet');
  await expect(page.locator('#search')).toHaveValue('overbruggingskrediet');
  await expect(page.locator('#app .sub').first()).toContainText('voor “overbruggingskrediet”');
  await page.goto('/index.html#zoek=nhg+grens&in=kennisbank');
  await expect(page.locator('#search')).toHaveValue('nhg grens');
  await expect(page.locator('#app h1')).toHaveText('Kennisbank');
  expect(fouten).toEqual([]);
});

test('#faq-<id> opent de FAQ-vraag', async ({ page }) => {
  await page.goto('/index.html#faq-hyp-001');
  await expect(page.locator('#faq-hyp-001')).toHaveAttribute('open', '');
});

for (const w of [390, 1280]) {
  test(`geen horizontale scroll en geen JS-fouten op ${w}px (favorieten, handleiding, koppelingen)`, async ({ page }) => {
    const fouten = await volgFouten(page);
    await page.setViewportSize({ width: w, height: 800 });
    for (const u of ['/index.html#favorieten', '/index.html#handleiding', '/koppelingen.html', '/privacy.html']) {
      await page.goto(u);
      await page.waitForTimeout(150);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sw, u).toBeLessThanOrEqual(w);
    }
    expect(fouten).toEqual([]);
  });
}

test('koppelingen.html: BSN-achtige referentie komt niet in de link', async ({ page }) => {
  await page.goto('/koppelingen.html');
  await page.fill('#b-ref', '123.456.782');
  await expect(page.locator('#b-melding')).toContainText('BSN');
  await expect(page.locator('#b-url')).not.toContainText('ref=');
  await page.fill('#b-ref', 'DOS-2026-0412');
  await expect(page.locator('#b-url')).toHaveText('https://jeroen-o.github.io/adviesforum/inkomensbepaling.html#vast&ref=DOS-2026-0412');
});
