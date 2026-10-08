// Wijzigingslog, volgen, verouderde bronnen, dossieruitdraai, kennisbankkoppeling, situatiecheck en productvoorwaarden
const { test, expect } = require('@playwright/test');
const path = require('path');
const { execFileSync } = require('child_process');
const { volgFouten } = require('./helpers');

const ROOT = path.join(__dirname, '..');
const node = (script, ...args) => execFileSync(process.execPath, [path.join(ROOT, 'tools', script), ...args], { cwd: ROOT, encoding: 'utf8' });

test('node tools/voorwaarden-wijzigingen.js --check: wijzigingslog is actueel', () => {
  expect(node('voorwaarden-wijzigingen.js', '--check')).toMatch(/actueel/);
});
test('node tools/productvoorwaarden.js --check: productvoorwaarden zijn actueel', () => {
  expect(node('productvoorwaarden.js', '--check')).toMatch(/actueel/);
});
test('node tools/voorwaarden-verouderd.js geeft een overzicht', () => {
  expect(node('voorwaarden-verouderd.js')).toMatch(/^Bronnen ouder dan 6 maanden: \d+/);
  const j = JSON.parse(node('voorwaarden-verouderd.js', '--json'));
  expect(Array.isArray(j.geldverstrekkers)).toBe(true);
});

test.describe('voorwaarden-vergelijker: wijzigingen, volgen en dossier', () => {
  let fouten;
  test.beforeEach(async ({ page }) => { fouten = await volgFouten(page); });
  test.afterEach(() => { expect(fouten).toEqual([]); });

  test('wijzigingslog staat op de pagina en volgen werkt via de functionele cookie', async ({ page, context }) => {
    await page.goto('/voorwaarden-vergelijker.html');
    await expect(page.locator('#wijzSub')).toContainText('sinds de publicatie');
    await expect(page.locator('#wijzLijst .wgroep').first()).toBeVisible();
    await page.selectOption('#volgKies', 'bunq');
    await expect(page.locator('#volgChips')).toContainText('bunq');
    const cookie = (await context.cookies()).find(c => c.name === 'af_favorieten');
    expect(decodeURIComponent(cookie.value)).toContain('g.bunq');
    await page.check('#wijzAlleenVolg');
    await expect(page.locator('#wijzLijst .wgroep h3').first()).toContainText('bunq');
    await page.locator('#volgChips button').click();
    await expect(page.locator('#volgChips')).toHaveText('');
  });

  test('bronnen ouder dan 6 maanden krijgen een signaal', async ({ page }) => {
    await page.goto('/voorwaarden-vergelijker.html');
    expect(await page.locator('td.val.oud').count()).toBeGreaterThan(0);
    await expect(page.locator('.legenda')).toContainText('Bron ouder dan 6 maanden');
  });

  test('vastleggen voor dossier opent een uitdraai met bron en status', async ({ page }) => {
    await page.goto('/voorwaarden-vergelijker.html#vergelijk=bunq,ing&k=zzp,erfp');
    const [pop] = await Promise.all([page.waitForEvent('popup'), page.click('#btnDossier')]);
    await pop.waitForLoadState();
    await expect(pop.locator('h1')).toHaveText('Dossiervastlegging: voorwaarden geldverstrekkers');
    await expect(pop.locator('table')).toContainText('geverifieerd op de site van de geldverstrekker');
    await expect(pop.locator('a', { hasText: 'Neem over in de adviesmotivatie' })).toHaveAttribute('href', /adviesmotivatie\.html#vgl=/);
  });

  test('alleen kenmerken in de link toont alle ingevulde geldverstrekkers', async ({ page }) => {
    await page.goto('/voorwaarden-vergelijker.html#k=erfp');
    await expect(page.locator('#cnt')).toContainText(/\d+ geselecteerd/);
  });
});

test('adviesmotivatie neemt vergeleken aanbieders over uit de link', async ({ page }) => {
  await page.goto('/adviesmotivatie.html#vgl=bunq,%20ING');
  await expect(page.locator('#overname')).toContainText('bunq, ING');
  await expect(page.locator('#x-product-aantal')).toHaveValue('2');
});

test('laatste nieuws toont wijzigingen in voorwaarden', async ({ page }) => {
  await page.goto('/laatste.html');
  await expect(page.locator('#l-voorwaarden li').first()).toContainText(/wijziging/);
});

test('kennisbankartikel over erfpacht linkt naar de vergelijker', async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForFunction(() => (window.KENNISBANK || []).some(a => a.cat === 'hyp' && /erfpacht/i.test(a.titel)));
  const id = await page.evaluate(() => (window.KENNISBANK || []).find(a => a.cat === 'hyp' && /erfpacht/i.test(a.titel)).id);
  await page.goto('/index.html#artikel-' + id);
  await expect(page.locator('.vw-koppeling a', { hasText: 'Erfpacht' })).toHaveAttribute('href', 'voorwaarden-vergelijker.html#k=erfp');
});

test.describe('productvoorwaarden', () => {
  let fouten;
  test.beforeEach(async ({ page }) => { fouten = await volgFouten(page); });
  test.afterEach(() => { expect(fouten).toEqual([]); });

  test('tabs, selectie in de link en geen premies', async ({ page }) => {
    await page.goto('/productvoorwaarden.html');
    await expect(page.locator('#tabs button')).toHaveCount(await page.evaluate(() => window.PRODUCTVOORWAARDEN.length));
    await expect(page.locator('#tabel td').first()).toBeVisible();
    await page.locator('#tabs button', { hasText: 'krediet' }).click();
    await expect(page.locator('#kredietMelding')).toBeVisible();
    await expect(page).toHaveURL(/#p=krediet/);
    const tekst = await page.locator('#tabel').textContent();
    expect(tekst).not.toMatch(/premie[^.]{0,20}€|\bJKP\b/i);
  });

  test('vastleggen voor dossier', async ({ page }) => {
    await page.goto('/productvoorwaarden.html#p=orv');
    const [pop] = await Promise.all([page.waitForEvent('popup'), page.click('#btnDossier')]);
    await pop.waitForLoadState();
    await expect(pop.locator('h1')).toContainText('Dossiervastlegging');
  });
});

test('node tools/situatiecheck.js --check: situatiecheck is actueel', () => {
  expect(node('situatiecheck.js', '--check')).toMatch(/actueel/);
});
test('situatiecheck: situatie kiezen toont geldverstrekkers op alfabet met onderbouwing', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/situatiecheck.html');
  await expect(page.locator('#samen')).toContainText('Kies een of meer situaties');
  await page.locator('.sit input').first().check();
  await expect(page).toHaveURL(/#s=/);
  const namen = await page.locator('.gv h3 > span:first-child').allTextContents();
  expect(namen.length).toBeGreaterThan(5);
  expect(namen).toEqual([...namen].sort((a, b) => a.localeCompare(b, 'nl')));
  await expect(page.locator('.gv .lab').first()).toBeVisible();
  expect(fouten).toEqual([]);
});

test('node tools/productvoorwaarden-wijzigingen.js --check: wijzigingslog productvoorwaarden is actueel', () => {
  expect(node('productvoorwaarden-wijzigingen.js', '--check')).toMatch(/actueel/);
});
test('productvoorwaarden: aanbieder volgen via de functionele cookie', async ({ page, context }) => {
  const fouten = await volgFouten(page);
  await page.goto('/productvoorwaarden.html#p=orv');
  await page.locator('thead .volg').first().click();
  await expect(page.locator('thead .volg[aria-pressed="true"]')).toHaveCount(1);
  const cookie = (await context.cookies()).find(c => c.name === 'af_favorieten');
  expect(decodeURIComponent(cookie.value)).toMatch(/p\.orv-/);
  await expect(page.locator('#wijzSub')).toContainText('sinds de eerste publicatie');
  expect(fouten).toEqual([]);
});
test('compliance-overzicht: prioriteit filtert en sorteert', async ({ page }) => {
  await page.goto('/compliance-overzicht.html');
  await page.selectOption('#f-prio', 'hoog');
  await expect(page.locator('#kb-tabel tbody tr').first().locator('td[data-k="Prioriteit"]')).toContainText('Hoog');
});
test('uitnodigen: tekst voor aanbieders met mailto', async ({ page }) => {
  await page.goto('/uitnodigen.html');
  await expect(page.locator('#aanb-mail')).toHaveAttribute('href', /^mailto:\?subject=/);
  await expect(page.locator('#aanb-tekst')).toContainText('aanbieder-aanleveren.html');
});
test('situatiecheck: twijfelgevallen zijn gemarkeerd', async ({ page }) => {
  await page.goto('/situatiecheck.html#s=dag');
  await expect(page.locator('.gv .tw').first()).toBeVisible();
});
test('situatiecheck: tabbladen ORV en AOV met situaties uit de productvoorwaarden', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/situatiecheck.html#p=orv&s=roker');
  await expect(page.locator('#tabs button[aria-selected="true"]')).toHaveText('ORV');
  await expect(page.locator('.gv').first()).toBeVisible();
  await expect(page.locator('.gv h3 a').first()).toHaveAttribute('href', /productvoorwaarden\.html#p=orv&a=/);
  await page.locator('#tabs button', { hasText: 'AOV' }).click();
  await expect(page.locator('#samen')).toContainText('Kies een of meer situaties');
  await expect(page.locator('#optNieuwLbl')).toBeHidden();
  expect(fouten).toEqual([]);
});
test('node tools/bronnen-lijst.js --check: bronnenlijst voor de linkcontrole is actueel', () => {
  expect(node('bronnen-lijst.js', '--check')).toMatch(/actueel/);
});
test('Klopt dit niet? opent een voorbereide mail in vergelijker en productvoorwaarden', async ({ page }) => {
  await page.goto('/voorwaarden-vergelijker.html#vergelijk=bunq&k=zzp');
  await expect(page.locator('td.val .meld').first()).toHaveAttribute('href', /^mailto:jeroen@oversteegen\.nl\?subject=Correctie/);
  await page.goto('/productvoorwaarden.html#p=orv');
  await expect(page.locator('#tabel td .meld').first()).toHaveAttribute('href', /^mailto:jeroen@oversteegen\.nl\?subject=Correctie/);
  await expect(page.locator('#tabel td .bron a', { hasText: 'archief' }).first()).toHaveAttribute('href', /^https:\/\/web\.archive\.org\/web\//);
});

test('node tools/voorwaarden-kwaliteit.js --check en voorwaarden-zoek.js --check zijn actueel', () => {
  expect(node('voorwaarden-kwaliteit.js', '--check')).toMatch(/actueel/);
  expect(node('voorwaarden-zoek.js', '--check')).toMatch(/actueel/);
});
test('voorwaarden.html: kerncijfers, kaarten en laatste wijzigingen', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/voorwaarden.html');
  await expect(page.locator('#tegels .tegel')).toHaveCount(4);
  await expect(page.locator('.kaart')).toHaveCount(6);
  await expect(page.locator('#wijz li').first()).toBeVisible();
  await expect(page.locator('#producten li')).toHaveCount(await page.evaluate(() => window.VOORWAARDEN_KWALITEIT.producten.length));
  expect(fouten).toEqual([]);
});
test('beheer-voorwaarden.html: werklijst gesorteerd op werkscore', async ({ page }) => {
  await page.goto('/beheer-voorwaarden.html');
  const scores = (await page.locator('#rijen tr td:last-child').allTextContents()).map(Number);
  expect(scores.length).toBeGreaterThan(5);
  expect(scores).toEqual([...scores].sort((a, b) => b - a));
});
test('zoeken in het forum vindt voorwaarden met link naar de cel', async ({ page }) => {
  await page.goto('/index.html#zoek=particuliere+erfpacht');
  await expect(page.locator('#zg-voorwaarden li a').first()).toHaveAttribute('href', /voorwaarden-vergelijker\.html#vergelijk=.+&k=erfp|productvoorwaarden\.html#p=/);
});
test('situatiecheck neemt passende aanbieders mee naar de vergelijker en adviesmotivatie vinkt voorwaarden aan', async ({ page }) => {
  await page.goto('/situatiecheck.html#s=perfp');
  await expect(page.locator('#btnMee')).toHaveAttribute('href', /^voorwaarden-vergelijker\.html#vergelijk=[a-z0-9,-]+&k=erfp$/);
  await page.goto('/adviesmotivatie.html#vgl=bunq&vw=boete,verh');
  await expect(page.locator('#x-product-criteria input[value="Boetevrij extra aflossen"]')).toBeChecked();
  await expect(page.locator('#x-product-criteria input[value="Verhuis- of meeneemregeling"]')).toBeChecked();
});
test('handleiding heeft het hoofdstuk Voorwaarden vergelijken', async ({ page }) => {
  await page.goto('/index.html#handleiding');
  await expect(page.locator('#h-voorwaarden')).toContainText('Voorwaarden vergelijken');
});
