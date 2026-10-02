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
