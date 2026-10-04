// Documenten van aanbieders: rubriek Rentebladen (alleen links, met melding), tijdstempel per document in NL-notatie,
// sortering nieuwste eerst, validatie in de beheerpagina en het meenemen van het tijdstempel door tools/aanbieder-import.js.
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execFileSync } = require('child_process');
const { volgFouten } = require('./helpers');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data', 'aanbieders.js');
const MOMENT = /^\d{4}-\d{2}-\d{2}(T([01]\d|2[0-3]):[0-5]\d)?$/;
const RENTEMELDING = 'Rentes wijzigen vaak. Controleer de datum en gebruik altijd het actuele renteblad van de aanbieder; dit is geen aanbod en geen advies.';
const laad = (bron = fs.readFileSync(DATA, 'utf8')) => { const c = { window: {} }; vm.runInNewContext(bron, c); return c.window.AANBIEDERS; };
const validatieBlok = (bestand, re) => fs.readFileSync(path.join(ROOT, bestand), 'utf8').match(re)[1];

test('data: elk document heeft een geldig tijdstempel; rentebladen alleen bij de voorbeelden en Obvion', () => {
  const L = laad();
  for (const a of L) for (const d of a.documenten || []) {
    expect(d.bijgewerkt, a.id + ': ' + d.titel).toMatch(MOMENT);
    expect(['voorwaarden', 'acceptatiegids', 'productblad', 'renteblad', 'formulier']).toContain(d.soort);
    if (d.geldigVanaf) { expect(d.soort).toBe('renteblad'); expect(d.geldigVanaf).toMatch(/^\d{4}-\d{2}-\d{2}$/); }
  }
  const rb = L.flatMap(a => (a.documenten || []).filter(d => d.soort === 'renteblad').map(d => ({ id: a.id, ...d })));
  expect(rb.map(x => x.id).sort()).toEqual(['obvion', 'voorbeeld-hypotheken', 'voorbeeld-verzekeringen']);
  for (const x of rb.filter(x => x.id.startsWith('voorbeeld-'))) {
    expect(x).toMatchObject({ titel: 'Renteblad (voorbeeld)', bijgewerkt: '2026-10-04T08:00', geldigVanaf: '2026-10-01' });
    expect(x.url).toMatch(/^https:\/\/example\.org\//);
  }
  const ob = rb.find(x => x.id === 'obvion');
  expect(ob).toMatchObject({ titel: 'Hypotheekrente en rentehistorie Obvion', url: 'https://obvion.nl/hypotheekrente/historie/', bijgewerkt: '2026-10-04' });
  expect(ob.geldigVanaf).toBeUndefined();
});

test('validatieblok in beheer en aanleveren is letterlijk gelijk', () => {
  const beheer = validatieBlok('aanbieder-beheer.html', /\/\* VALIDATIE-BEGIN[^\n]*\n([\s\S]*?)\/\* VALIDATIE-EINDE \*\//);
  const aanl = validatieBlok('aanbieder-aanleveren.html', /\/\* KOPIE-VALIDATIE[^\n]*\n([\s\S]*?)\/\* EINDE-KOPIE-VALIDATIE \*\//);
  expect(aanl).toBe(beheer);
  const V = {};
  vm.runInNewContext(beheer + '\n;O.normaliseer=normaliseer;O.valideer=valideer;', { O: V });
  const basis = { id: 'test', naam: 'Test', type: 'geldverstrekker' };
  const fouten = docs => V.valideer(V.normaliseer({ ...basis, documenten: docs })).fouten.map(f => f.msg).join(' | ');
  expect(fouten([{ titel: 'Renteblad', url: 'https://example.org/r.pdf', soort: 'renteblad', bijgewerkt: '2026-10-04T07:12', geldigVanaf: '2026-10-01' }])).toBe('');
  expect(fouten([{ titel: 'Renteblad', url: 'http://example.org/r.pdf', soort: 'renteblad', bijgewerkt: '2026-10-04' }])).toMatch(/renteblad moet een https-link/);
  expect(fouten([{ titel: 'Gids', url: 'https://example.org/g.pdf', soort: 'acceptatiegids', bijgewerkt: '2026-02-30' }])).toMatch(/tijdstempel is ongeldig/);
  expect(fouten([{ titel: 'Gids', url: 'https://example.org/g.pdf', soort: 'acceptatiegids', bijgewerkt: '2026-10-04T24:00' }])).toMatch(/tijdstempel is ongeldig/);
  expect(fouten([{ titel: 'Gids', url: 'https://example.org/g.pdf', soort: 'acceptatiegids', geldigVanaf: '2026-10-01' }])).toMatch(/alleen bij een renteblad/);
  expect(fouten([{ titel: 'Renteblad', url: 'https://example.org/r.pdf', soort: 'renteblad', geldigVanaf: '1-10-2026' }])).toMatch(/geldig vanaf is ongeldig/);
});

test('detail: rubriek Rentebladen met melding, tijdstempels in NL-notatie en laatste documentwijziging', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/aanbieders.html#aanbieder-voorbeeld-hypotheken');
  await expect(page.locator('#laatste-doc')).toHaveText('Laatste documentwijziging: 4 oktober 2026, 08:00');
  await page.locator('[data-tab="documenten"]').click();
  const groep = page.locator('.docgroep[data-soort="renteblad"]');
  await expect(groep.locator('h3')).toHaveText('Rentebladen');
  await expect(groep.locator('.rentemelding')).toHaveText(RENTEMELDING);
  await expect(groep.locator('.item .stempel-doc')).toHaveText('bijgewerkt 4 oktober 2026, 08:00 · geldig vanaf 1 oktober 2026');
  await expect(groep.locator('a.link')).toHaveAttribute('href', 'https://example.org/documenten/renteblad.pdf');
  // Document zonder tijd: alleen de datum
  await expect(page.locator('.docgroep[data-soort="voorwaarden"] .stempel-doc').first()).toHaveText('bijgewerkt 1 oktober 2026');
  await expect(page.locator('.docgroep[data-soort="voorwaarden"] .stempel-doc time').first()).toHaveAttribute('datetime', '2026-10-01');
  // Rentes en tarieven toont de pagina zelf niet
  await expect(page.locator('#algemeen')).toContainText('Het Adviesforum toont zelf geen rentes, tarieven, premies of acties. Aanbieders kunnen wel verwijzen naar hun eigen renteblad; de actuele rente staat altijd bij de aanbieder.');
  expect(fouten).toEqual([]);
});

test('detail Obvion: renteblad als link naar de eigen site, met melding en zonder geldig vanaf', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/aanbieders.html#aanbieder-obvion');
  await page.locator('[data-tab="documenten"]').click();
  const groep = page.locator('.docgroep[data-soort="renteblad"]');
  await expect(groep.locator('.rentemelding')).toHaveText(RENTEMELDING);
  await expect(groep.locator('.item b')).toHaveText('Hypotheekrente en rentehistorie Obvion');
  await expect(groep.locator('a.link')).toHaveAttribute('href', 'https://obvion.nl/hypotheekrente/historie/');
  await expect(groep.locator('.stempel-doc')).toContainText('bijgewerkt 4 oktober 2026');
  await expect(groep.locator('.stempel-doc')).not.toContainText('geldig vanaf');
  await expect(page.locator('.demo-band').first()).toContainText('door de redactie toegevoegd');
  expect(fouten).toEqual([]);
});

test('detail: documenten binnen een soort nieuwste eerst', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.route('**/data/aanbieders.js', async route => {
    const extra = ";(function(){var a=window.AANBIEDERS.find(function(x){return x.id==='voorbeeld-hypotheken';});" +
      "a.documenten.push({titel:'Oud',url:'https://example.org/oud.pdf',soort:'voorwaarden',bijgewerkt:'2025-01-02'}," +
      "{titel:'Nieuwst',url:'https://example.org/nieuw.pdf',soort:'voorwaarden',bijgewerkt:'2026-10-04T07:12'}," +
      "{titel:'Zelfde dag eerder',url:'https://example.org/eerder.pdf',soort:'voorwaarden',bijgewerkt:'2026-10-04T06:05'});})();";
    route.fulfill({ status: 200, contentType: 'application/javascript', body: fs.readFileSync(DATA, 'utf8') + extra });
  });
  await page.goto('/aanbieders.html#aanbieder-voorbeeld-hypotheken');
  await page.locator('[data-tab="documenten"]').click();
  await expect(page.locator('.docgroep[data-soort="voorwaarden"] .item b')).toHaveText(['Nieuwst', 'Zelfde dag eerder', 'Algemene voorwaarden hypotheken (voorbeeld)', 'Oud']);
  await expect(page.locator('.docgroep[data-soort="voorwaarden"] .stempel-doc').first()).toHaveText('bijgewerkt 4 oktober 2026, 07:12');
  await expect(page.locator('#laatste-doc')).toHaveText('Laatste documentwijziging: 4 oktober 2026, 08:00');
  expect(fouten).toEqual([]);
});

test('beheer: nieuw document krijgt tijdstempel nu; renteblad vereist https en een geldige datum', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.clock.setFixedTime(new Date('2026-10-04T07:12:00'));
  const code = 'TEST-RENT-EBLD';
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  await page.route('**/data/aanbieders.js', route => route.fulfill({ status: 200, contentType: 'application/javascript',
    body: fs.readFileSync(DATA, 'utf8') + ";window.AANBIEDERS.find(function(x){return x.id==='voorbeeld-hypotheken';}).codeHash='" + hash + "';" }));
  await page.goto('/aanbieder-beheer.html');
  await page.locator('#lg-code').fill(code);
  await page.locator('#f-login button[type="submit"]').click();
  await expect(page.locator('#wie-id')).toHaveText('voorbeeld-hypotheken');
  // Bestaand renteblad (index 4) toont het veld geldig vanaf; overige documenten niet
  await expect(page.locator('#f-documenten-4-geldigVanaf')).toHaveValue('2026-10-01');
  await expect(page.locator('#f-documenten-0-geldigVanaf')).toHaveCount(0);
  await expect(page.locator('#f-documenten-0-bijgewerkt')).toHaveValue('2026-10-01');
  // Toevoegen: tijdstempel staat op nu
  await page.locator('[data-erbij="documenten"]').click();
  await expect(page.locator('#f-documenten-5-bijgewerkt')).toHaveValue('2026-10-04T07:12');
  await page.locator('#f-documenten-5-titel').fill('Renteblad november');
  await page.locator('#f-documenten-5-soort').selectOption('renteblad');
  await expect(page.locator('#f-documenten-5-geldigVanaf')).toBeVisible();
  await page.locator('#f-documenten-5-url').fill('http://example.org/renteblad-nov.pdf');
  await expect(page.locator('#validatie')).toContainText('Document 6: een renteblad moet een https-link zijn');
  await page.locator('#f-documenten-5-url').fill('https://example.org/renteblad-nov.pdf');
  await expect(page.locator('#validatie')).not.toContainText('https-link');
  await page.locator('#f-documenten-5-bijgewerkt').fill('4-10-2026 07:12');
  await expect(page.locator('#validatie')).toContainText('Document 6: tijdstempel is ongeldig (JJJJ-MM-DD of JJJJ-MM-DDTuu:mm).');
  await expect(page.locator('#f-documenten-5-bijgewerkt')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#f-documenten-5-geldigVanaf').fill('2026-11-01');
  await page.locator('#f-documenten-5-bijgewerkt').fill('2026-10-04T07:30');
  await expect(page.locator('#validatie .fout-blok')).toHaveCount(0);
  const json = JSON.parse(await page.locator('#json').inputValue());
  expect(json.documenten[5]).toEqual({ titel: 'Renteblad november', url: 'https://example.org/renteblad-nov.pdf', soort: 'renteblad', bijgewerkt: '2026-10-04T07:30', geldigVanaf: '2026-11-01' });
  // Een bestaand document wijzigen zet het tijdstempel op nu
  await page.locator('#f-documenten-0-titel').fill('Algemene voorwaarden hypotheken 2026 (voorbeeld)');
  await expect(page.locator('#f-documenten-0-bijgewerkt')).toHaveValue('2026-10-04T07:12');
  expect(fouten).toEqual([]);
});

test('import: neemt bijgewerkt en geldigVanaf mee en zet de importdatum bij een document zonder tijdstempel', () => {
  const dir = test.info().outputPath('import');
  fs.mkdirSync(dir, { recursive: true });
  const dataKopie = path.join(dir, 'aanbieders.js');
  fs.copyFileSync(DATA, dataKopie);
  const a = JSON.parse(JSON.stringify(laad().find(x => x.id === 'voorbeeld-hypotheken')));
  delete a.documenten[0].bijgewerkt;
  a.documenten[1].bijgewerkt = '2026-10-04T09:15';
  const invoer = path.join(dir, 'aanbieder-voorbeeld-hypotheken.json');
  fs.writeFileSync(invoer, JSON.stringify(a));
  const uit = execFileSync('node', [path.join(ROOT, 'tools', 'aanbieder-import.js'), invoer, '--data', dataKopie], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  expect(uit).toContain('Vervangen: Voorbeeld Hypotheken');
  const docs = laad(fs.readFileSync(dataKopie, 'utf8')).find(x => x.id === 'voorbeeld-hypotheken').documenten;
  const d = new Date(), vandaag = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  expect(docs[0].bijgewerkt).toBe(vandaag);
  expect(docs[1].bijgewerkt).toBe('2026-10-04T09:15');
  expect(docs.find(x => x.soort === 'renteblad')).toEqual({ titel: 'Renteblad (voorbeeld)', url: 'https://example.org/documenten/renteblad.pdf', soort: 'renteblad', bijgewerkt: '2026-10-04T08:00', geldigVanaf: '2026-10-01' });
  // Ongeldig tijdstempel: geweigerd, niets geschreven
  a.documenten[1].bijgewerkt = '2026-10-04 9:15';
  fs.writeFileSync(invoer, JSON.stringify(a));
  const voor = fs.readFileSync(dataKopie, 'utf8');
  let fout = '';
  try { execFileSync('node', [path.join(ROOT, 'tools', 'aanbieder-import.js'), invoer, '--data', dataKopie], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); } catch (e) { fout = e.stderr; }
  expect(fout).toContain('tijdstempel is ongeldig');
  expect(fs.readFileSync(dataKopie, 'utf8')).toBe(voor);
});

test('aanleveren: document krijgt tijdstempel nu en geldig vanaf alleen bij renteblad', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.clock.setFixedTime(new Date('2026-10-04T07:12:00'));
  await page.goto('/aanbieder-aanleveren.html');
  const fs6 = page.locator('[data-lijst="documenten"]');
  await fs6.locator('.toevoegen').click();
  const kaart = fs6.locator('.rijkaart').first();
  await expect(kaart.locator('[data-k="bijgewerkt"]')).toHaveValue('2026-10-04T07:12');
  await expect(kaart.locator('[data-k="geldigVanaf"]')).toBeHidden();
  await kaart.locator('[data-k="soort"]').selectOption('renteblad');
  await expect(kaart.locator('[data-k="geldigVanaf"]')).toBeVisible();
  await expect(kaart.locator('p.tip[data-alleen="renteblad"]')).toBeVisible();
  await expect(page.locator('#kop-niet ~ ul')).toContainText('een link naar je eigen renteblad mag wel');
  expect(fouten).toEqual([]);
});
