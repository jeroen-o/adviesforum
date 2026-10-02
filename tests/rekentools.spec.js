// Rekenhulpen (rekentools.html + js/rekentools/*.js): elke geregistreerde hulp moet met de
// standaardvoorbeelden een uitkomst geven, zonder JS-fouten en zonder horizontale scroll op mobiel.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const path = require('path');
const { volgFouten } = require('./helpers');

test('rekentools: zoekcatalogus data/rekentools-index.js is actueel', async () => {
  // Faalt als iemand een hulp toevoegt of wijzigt zonder: node tools/build-rekentools-index.js
  execFileSync(process.execPath, [path.join(__dirname, '..', 'tools', 'build-rekentools-index.js'), '--check'], { stdio: 'pipe' });
});

for (const breedte of [390, 1280]) {
  test(`rekentools: alle hulpen rekenen met het voorbeeld (${breedte}px)`, async ({ page }) => {
    test.setTimeout(120000);
    const fouten = await volgFouten(page);
    await page.setViewportSize({ width: breedte, height: 900 });
    await page.goto('/rekentools.html');
    const ids = await page.evaluate(() => window.RT.tools.map(t => t.id));
    expect(ids.length).toBeGreaterThan(30);
    const zonderUitkomst = [], teBreed = [];
    for (const id of ids) {
      await page.evaluate(i => { location.hash = i; }, id);
      await page.waitForFunction(i => document.querySelector('#kies').value === i, id);
      if (!(await page.locator('#hoofduitkomst').count())) zonderUitkomst.push(id);
      const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (over > 0) teBreed.push(id + ' (+' + over + 'px)');
    }
    expect(zonderUitkomst, 'hulpen zonder uitkomst bij het voorbeeld').toEqual([]);
    expect(teBreed, 'hulpen met horizontale scroll').toEqual([]);
    expect(fouten).toEqual([]);
  });
}

test('rekentools: hash-link, zoeken en catalogus komen overeen', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/rekentools.html#rente-omrekenen');
  await expect(page.locator('.paneel-kop h2')).toHaveText('Nominale en effectieve rente');
  await page.fill('#zoek', 'werkdagen');
  await expect(page.locator('#menulijst button[data-id="periode"]')).toBeVisible();
  await expect(page.locator('#menulijst button[data-id="renteherziening"]')).toBeHidden();
  const ids = await page.evaluate(() => window.RT.tools.map(t => t.id).sort());
  await page.addScriptTag({ url: '/data/rekentools-index.js' });
  const catalogus = await page.evaluate(() => window.REKENTOOLS.map(t => t.id).sort());
  expect(catalogus).toEqual(ids);
  expect(fouten).toEqual([]);
});

test('rekentools: vaste voorbeelden van de oorspronkelijke hulpen', async ({ page }) => {
  await volgFouten(page);
  const verwacht = {
    renteherziening: '€ 1.423,19', rentemix: '3,782%', aflostijd: '4 jaar en 6 maanden',
    opbouw: '€ 113.169', jaarinkomen: '€ 53.136', periode: '63'
  };
  await page.goto('/rekentools.html');
  for (const [id, tekst] of Object.entries(verwacht)) {
    await page.evaluate(i => { location.hash = i; }, id);
    await expect(page.locator('#hoofduitkomst')).toHaveText(tekst);
  }
});

test('rekentools: startscherm toont overzicht met aantal, zoeken, groepen en populair', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/rekentools.html');
  const n = await page.evaluate(() => window.RT.tools.length);
  await expect(page.locator('h1')).toContainText(n + ' rekenhulpen');
  await expect(page.locator('#ov-titel')).toHaveText(n + ' rekenhulpen');
  await expect(page.locator('#hoofduitkomst')).toHaveCount(0);
  await expect(page.locator('.ov-pop .ov-tegel')).toHaveCount(8);
  const groepen = await page.evaluate(() => window.RT.GROEPEN.length);
  await expect(page.locator('.ov-groep')).toHaveCount(groepen);
  await page.fill('#ov-zoek', 'jaarruimte');
  await expect(page.locator('#ov-lijst a[data-id="lijfrente-jaarruimte"]')).toBeVisible();
  await page.locator('#ov-lijst a[data-id="lijfrente-jaarruimte"]').click();
  await expect(page.locator('.paneel-kop h2')).toHaveText('Lijfrente: jaarruimte en belastingvoordeel');
  await page.goBack();
  await expect(page.locator('#ov-titel')).toBeVisible();
  expect(fouten).toEqual([]);
});

test('rekentools: dossiertekst bevat toolnaam, invoer, uitkomst en link', async ({ page, context }) => {
  const fouten = await volgFouten(page);
  await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
  await page.goto('/rekentools.html#renteherziening');
  await page.fill('#v-h', '300000');
  await expect(page.locator('#v-h')).toHaveValue('300.000');
  await page.click('#kopieer-dossier');
  await expect(page.locator('#deel-status')).toContainText(/gekopieerd|Selecteer/);
  const tekst = await page.evaluate(() => window.RT.dossiertekst());
  expect(tekst).toContain('Maandlast na renteherziening');
  expect(tekst).toContain('Oorspronkelijke hoofdsom: € 300.000');
  expect(tekst).toContain('Rente voor de nieuwe periode: 4,1%');
  expect(tekst).toMatch(/Berekening: http.*#renteherziening\?.*h=300000/);
  const klembord = await page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
  if (klembord !== null) expect(klembord).toBe(tekst);
  expect(fouten).toEqual([]);
});

test('rekentools: deeplink vult invoer uit de hash en werkt de hash bij', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/rekentools.html#renteherziening?h=250000&rn=3.5&vorm=lin');
  await expect(page.locator('.paneel-kop h2')).toHaveText('Maandlast na renteherziening');
  await expect(page.locator('#v-h')).toHaveValue('250.000');
  await expect(page.locator('#v-rn')).toHaveValue('3,5');
  await expect(page.locator('#v-vorm')).toHaveValue('lin');
  await expect(page.locator('#v-jr')).toHaveValue('30'); // niet meegegeven: standaardwaarde
  await page.fill('#v-ro', '2,25');
  await expect.poll(() => page.evaluate(() => location.hash)).toContain('ro=2.25');
  // dezelfde link in een nieuwe pagina geeft dezelfde uitkomst
  const hash = await page.evaluate(() => location.hash);
  const uitkomst = await page.locator('#hoofduitkomst').textContent();
  const tweede = await page.context().newPage();
  await tweede.goto('/rekentools.html' + hash);
  await expect(tweede.locator('#hoofduitkomst')).toHaveText(uitkomst);
  await expect(tweede.locator('#v-ro')).toHaveValue('2,25');
  // hash wijzigen naar andere waarde op dezelfde hulp wordt overgenomen
  await page.evaluate(() => { location.hash = 'renteherziening?h=400000'; });
  await expect(page.locator('#v-h')).toHaveValue('400.000');
  expect(fouten).toEqual([]);
});
