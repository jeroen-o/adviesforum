// Aanbieders volgen (cookie af_favorieten, token "b.<id>"), agenda van aanbieders (.ics), rubriekfilter en kalender.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { volgFouten } = require('./helpers');

const VANDAAG = new Date('2026-10-03T10:00:00');
const cookieWaarde = async ctx => {
  const c = (await ctx.cookies()).find(x => x.name === 'af_favorieten');
  return c ? decodeURIComponent(c.value) : '';
};
const geenHorizontaleScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);

test('data: agenda alleen bij de fictieve aanbieders, rekenexperts en rubriek bankgarantie aanwezig', () => {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'data', 'aanbieders.js'), 'utf8'), ctx);
  const L = ctx.window.AANBIEDERS;
  const metAgenda = L.filter(a => Array.isArray(a.agenda) && a.agenda.length).map(a => a.id).sort();
  expect(metAgenda).toEqual(['voorbeeld-hypotheken', 'voorbeeld-verzekeringen']);
  for (const a of L.filter(a => a.agenda)) {
    const ids = a.agenda.map(x => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const x of a.agenda) {
      expect(x.datum).toMatch(/^2026-1[0-2]-\d{2}$/);
      expect(x.url).toMatch(/^https:\/\/example\.org\//);
      expect(['webinar', 'bijeenkomst', 'e-learning', 'beurs', 'overig']).toContain(x.soort);
    }
  }
  expect(new Set(L.map(a => a.id)).size).toBe(L.length);
  for (const id of ['pentrax', 'zakelijk-inkomen', 'raadhuys', 'bnp-paribas-cardif', 'acura-assuradeuren', 'huismerk', 'vcn-kredieten', 'voogd-en-voogd']) {
    const a = L.find(x => x.id === id);
    expect(a, id).toBeTruthy();
    expect(a.demo).toBe(true);
    expect(fs.existsSync(path.join(__dirname, '..', a.logo))).toBe(true);
  }
  expect(L.find(x => x.id === 'raadhuys').naam).toBe('Raadhuys Tax Legal Accounting');
  expect(L.filter(a => (a.rubrieken || []).includes('bankgarantie')).map(a => a.id).sort()).toEqual(['bnp-paribas-cardif', 'nationale-waarborg']);
  expect(L.find(x => x.id === 'bnp-paribas').rubrieken).toBeUndefined();
});

test('volgen: cookie, bovenaan, filter, nieuwsblok, na herladen en in Mijn favorieten', async ({ page, context, baseURL }) => {
  const fouten = await volgFouten(page);
  await page.clock.setFixedTime(VANDAAG);
  // Bestaande favorieten van index.html moeten blijven staan
  await context.addCookies([{ name: 'af_favorieten', value: encodeURIComponent('1~v.test1~~~~'), url: baseURL + '/' }]);
  await page.goto('/aanbieders.html');
  await expect(page.locator('#gevolgd-kop')).toHaveCount(0);
  const knop = page.locator('#tegels [data-volg="voorbeeld-verzekeringen"]');
  await expect(knop).toHaveAttribute('aria-pressed', 'false');
  await expect(knop).toHaveText('Volgen');
  await knop.click();
  await expect(page.locator('#tegels [data-volg="voorbeeld-verzekeringen"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#tegels [data-volg="voorbeeld-verzekeringen"]')).toHaveText('Volgend');
  let w = await cookieWaarde(context);
  expect(w.split('~')[1].split('_').sort()).toEqual(['b.voorbeeld-verzekeringen', 'v.test1']);
  // Gevolgde aanbieder bovenaan en nieuwsblok zichtbaar
  await expect(page.locator('#tegels .tegelvak').first().locator('[data-volg]')).toHaveAttribute('data-volg', 'voorbeeld-verzekeringen');
  await expect(page.locator('#gevolgd-kop')).toHaveText('Nieuws van aanbieders die je volgt');
  await expect(page.locator('#gevolgd-nieuws .bericht').first()).toContainText('Voorbeeld Verzekeringen');
  // Filter: alleen wie je volgt
  await page.locator('#alleen-volg').check();
  await expect(page.locator('#tegels .tegelvak')).toHaveCount(1);
  await page.locator('#alleen-volg').uncheck();
  expect(await page.locator('#tegels .tegelvak').count()).toBeGreaterThan(10);
  // Na herladen blijft het staan
  await page.reload();
  await expect(page.locator('#tegels [data-volg="voorbeeld-verzekeringen"]')).toHaveAttribute('aria-pressed', 'true');
  await page.locator('#alleen-volg').check();
  await expect(page.locator('#tegels .tegelvak')).toHaveCount(1);
  // index.html: sectie in Mijn favorieten, en herschrijven van de cookie laat het b-token staan
  await page.goto('/index.html#favorieten');
  const blok = page.locator('#fav-aanbieders');
  await expect(blok.locator('a[href="aanbieders.html#aanbieder-voorbeeld-verzekeringen"]')).toHaveText('Voorbeeld Verzekeringen');
  await page.evaluate(() => { leesFav(); bewaarFav(); }); // eslint-disable-line no-undef
  w = await cookieWaarde(context);
  expect(w.split('~')[1].split('_').sort()).toEqual(['b.voorbeeld-verzekeringen', 'v.test1']);
  // Ontvolgen op de detailpagina
  await page.goto('/aanbieders.html#aanbieder-voorbeeld-verzekeringen');
  const dk = page.locator('.detailkop [data-volg="voorbeeld-verzekeringen"]');
  await expect(dk).toHaveAttribute('aria-pressed', 'true');
  await dk.click();
  await expect(page.locator('.detailkop [data-volg="voorbeeld-verzekeringen"]')).toHaveAttribute('aria-pressed', 'false');
  w = await cookieWaarde(context);
  expect(w.split('~')[1]).toBe('v.test1');
  expect(fouten).toEqual([]);
});

test('agenda: overzicht, tabblad, verlopen items, anker en .ics-bestand', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.clock.setFixedTime(new Date('2026-11-15T10:00:00'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/aanbieders.html');
  // Komende activiteiten: alleen vanaf vandaag (15 november: nog 2 van de 5 voorbeelditems)
  const komend = page.locator('#agenda ~ ol.feed').first().locator('.agenda-item');
  await expect(komend).toHaveCount(2);
  await expect(komend.first()).toContainText('3 december 2026');
  expect(await geenHorizontaleScroll(page)).toBe(true);

  await page.goto('/aanbieders.html#aanbieder-voorbeeld-hypotheken');
  await page.locator('#tab-agenda').click();
  await expect(page.locator('#tab-agenda')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#paneel > ol.feed .agenda-item')).toHaveCount(1);
  await expect(page.locator('#paneel > ol.feed .agenda-item').first()).toContainText('8 december 2026');
  const verlopen = page.locator('#paneel details.verlopen-blok');
  await expect(verlopen).not.toHaveAttribute('open', '');
  await expect(verlopen.locator('summary')).toHaveText('Verlopen activiteiten (2)');
  await expect(verlopen.locator('.agenda-item.verlopen')).toHaveCount(2);
  expect(await geenHorizontaleScroll(page)).toBe(true);

  // Anker naar een verlopen item: tab Agenda, ingeklapt blok open, uitgelicht
  await page.goto('/aanbieders.html#agenda-voorbeeld-hypotheken-a2');
  const item = page.locator('#agenda-voorbeeld-hypotheken-a2');
  await expect(item).toBeVisible();
  await expect(item).toHaveClass(/uitgelicht/);
  await expect(item).toContainText('PE-punten volgens de aanbieder');
  await expect(item).toContainText('12 november 2026');

  // .ics downloaden
  const [download] = await Promise.all([page.waitForEvent('download'), item.locator('[data-ics]').click()]);
  expect(download.suggestedFilename()).toBe('agenda-voorbeeld-hypotheken-a2.ics');
  const ics = fs.readFileSync(await download.path(), 'utf8');
  expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
  expect(ics).toContain('DTSTART;TZID=Europe/Amsterdam:20261112T133000');
  expect(ics).toContain('DTEND;TZID=Europe/Amsterdam:20261112T170000');
  expect(ics).toContain('BEGIN:VTIMEZONE');
  expect(ics).toContain('UID:agenda-voorbeeld-hypotheken-a2@adviesforum');
  expect(ics.replace(/\r\n /g, '')).toContain('SUMMARY:(Voorbeeld) Regiobijeenkomst Zuid');
  expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true);
  for (const r of ics.split('\r\n')) expect(Buffer.byteLength(r, 'utf8')).toBeLessThanOrEqual(75);

  // Hele-dag-item zonder tijd
  await page.goto('/aanbieders.html#agenda-voorbeeld-verzekeringen-a2');
  const href = await page.locator('#agenda-voorbeeld-verzekeringen-a2 [data-ics]').getAttribute('href');
  const ics2 = decodeURIComponent(href.replace(/^data:text\/calendar;charset=utf-8,/, ''));
  expect(ics2).toContain('DTSTART;VALUE=DATE:20261203');
  expect(ics2).toContain('DTEND;VALUE=DATE:20261204');
  expect(fouten).toEqual([]);
});

test('rubriek bankgaranties: badge en filter; rekenexperts zichtbaar', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/aanbieders.html');
  await page.locator('[data-rubriekfilter="bankgarantie"]').check();
  const tegels = page.locator('#tegels .tegelvak');
  await expect(tegels).toHaveCount(2);
  await expect(tegels.locator('.badge.rubriek').first()).toHaveText('Bankgaranties en bieden met zekerheid');
  expect((await tegels.locator('[data-volg]').evaluateAll(b => b.map(x => x.dataset.volg))).sort()).toEqual(['bnp-paribas-cardif', 'nationale-waarborg']);
  await page.locator('[data-rubriekfilter="bankgarantie"]').uncheck();
  for (const id of ['pentrax', 'zakelijk-inkomen', 'raadhuys']) await expect(page.locator(`#tegels a[href="#aanbieder-${id}"] img`)).toHaveCount(1);
  await page.goto('/aanbieders.html#aanbieder-bnp-paribas-cardif');
  await expect(page.locator('.detailkop .badge.rubriek')).toHaveText('Bankgaranties en bieden met zekerheid');
  expect(fouten).toEqual([]);
});

test('kalender: activiteiten van aanbieders als eigen categorie, voorbeeld gelabeld', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.clock.setFixedTime(VANDAAG);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/kalender.html');
  await expect(page.locator('#themaknoppen .chip', { hasText: 'Activiteiten van aanbieders' })).toHaveCount(1);
  await page.locator('#tab-lijst').click();
  const kaart = page.locator('#l-ab-voorbeeld-hypotheken-a2');
  await expect(kaart).toBeVisible();
  await expect(kaart).toContainText('Voorbeeld');
  await expect(kaart).toContainText('PE-punten volgens de aanbieder');
  await expect(kaart.locator('a.bron')).toHaveAttribute('href', 'aanbieders.html#agenda-voorbeeld-hypotheken-a2');
  await expect(page.locator('#lijst [id^="l-ab-"]')).toHaveCount(5);
  expect(await geenHorizontaleScroll(page)).toBe(true);
  expect(fouten).toEqual([]);
});
