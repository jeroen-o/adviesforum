// Voorwaardenvergelijker geldverstrekkers (voorwaarden-vergelijker.html)
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const { volgFouten } = require('./helpers');

const PAGINA = '/voorwaarden-vergelijker.html?bron=dataset';
const BRON_NAMEN = ['ABN AMRO', 'Rabobank', 'ING', 'SNS', 'RegioBank', 'Munt Hypotheken', 'Obvion', 'Florius', 'Aegon',
  'Nationale-Nederlanden', 'BLG Wonen', 'Tulp Hypotheken', 'Attens Hypotheken', 'Lloyds Bank', 'Hypotrust', 'Venn Hypotheken',
  'Vista Hypotheken', 'bijBouwe', 'Woonfonds', 'Merius Hypotheken', 'a.s.r.', 'Centraal Beheer', 'Triodos Bank', 'NIBC', 'ASN Bank'];
const BRON_VOORWAARDEN = ['Zzp / ondernemer', 'Flexwerk & uitzend', 'Perspectiefverklaring', 'Inkomen na AOW', 'Erfpacht',
  'Rentevastperioden', 'Dagrentegarantie', 'Geldigheidsduur aanbod', 'Boetevrij aflossen', 'Risicoklassen & LTV-daling',
  'Looptijd bouwdepot', 'Rentevergoeding depot', 'Declaratie & uitbetaling', 'Energiebespaarbudget', 'Verduurzamingsvoordeel',
  'Verhuisregeling', 'Onderhandse verkoop', 'Ontslag hoofdelijkheid', 'Verhoging / 2e hypotheek', 'Overbruggingskrediet', 'Bron / peildatum'];
const TOTAAL = 50, HOOFD = 43, OVERIG = 7, VOORWAARDEN = 32, INGEVULD = 32;

const rijen = page => page.locator('#matrix tbody tr[data-id]');
const exact = naam => new RegExp('^' + naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
const rij = (page, naam) => page.locator('#matrix tbody tr[data-id]').filter({ has: page.locator('.vn', { hasText: exact(naam) }) });
const naamCel = (page, naam) => page.locator('#matrix tbody tr[data-id] .vn', { hasText: new RegExp('^' + naam.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') });

test.describe('voorwaardenvergelijker', () => {
  let fouten;
  test.beforeEach(async ({ page }) => {
    fouten = await volgFouten(page);
    page.on('dialog', d => { fouten.push('onverwachte dialog: ' + d.message()); d.dismiss(); });
    await page.goto(PAGINA);
  });
  test.afterEach(() => { expect(fouten).toEqual([]); });

  test('matrix toont alle 25 bronverstrekkers, de aanvullingen en alle voorwaarden', async ({ page }) => {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
    await expect(page.locator('#stempel')).toContainText('Indicatief · niet geverifieerd · peildatum oktober 2026');
    await expect(page.locator('.compliance')).toContainText('Bevat geen rentes of tarieven');
    await expect(page.locator('.compliance')).toContainText('4:19');
    await expect(rijen(page)).toHaveCount(HOOFD);
    for (const n of BRON_NAMEN) await expect(naamCel(page, n)).toHaveCount(1);
    const koppen = await page.locator('#matrix thead th').allTextContents();
    expect(koppen.length).toBe(VOORWAARDEN + 1);
    for (const v of BRON_VOORWAARDEN) expect(koppen.some(k => k.includes(v)), v).toBe(true);
    // verouderde namen met huidige naam
    await expect(rij(page, 'SNS').locator('.hint')).toHaveText('(nu ASN Bank)');
    await expect(rij(page, 'Aegon').locator('.hint')).toHaveText('(nu a.s.r.)');
    await expect(rij(page, 'Woonfonds').locator('.hint')).toHaveText('(nu Centraal Beheer)');
    // geen logo bij oude merken, wel bij ABN AMRO
    for (const n of ['SNS', 'Aegon', 'Woonfonds']) await expect(rij(page, n).locator('img')).toHaveCount(0);
    await expect(rij(page, 'ABN AMRO').locator('img.plogo')).toHaveAttribute('src', 'img/logos/abn-amro.png');
    // brondata 1-op-1, inclusief kleurcode
    const abn = rij(page, 'ABN AMRO');
    await expect(abn).toContainText('1 jaar met Inkomensverklaring Ondernemer (NHG); 3 jaar daarbuiten');
    await expect(abn.locator('td.val').nth(4).locator('.tint')).toHaveClass(/t-a/);
    // overige financiers inklapbaar
    await page.locator('#overigKnop').click();
    await expect(page.locator('#overigKnop')).toHaveAttribute('aria-expanded', 'true');
    await expect(rijen(page)).toHaveCount(TOTAAL);
    await expect(naamCel(page, 'Domivest')).toHaveCount(1);
  });

  test('nieuwe verstrekkers en voorwaarden staan op "nog in te vullen"', async ({ page }) => {
    const argenta = rij(page, 'Argenta');
    await expect(argenta.locator('.nogleeg').first()).toHaveText('nog in te vullen');
    await expect(argenta.locator('.tint.t-e').first()).toBeVisible();
    await expect(argenta).toContainText('Nog niet ingevuld');
    await expect(page.locator('#ingevuld')).toHaveText(`${INGEVULD} van ${TOTAAL} verstrekkers ingevuld`);
    await expect(page.locator('.legenda')).toContainText('Nog in te vullen');
    await page.locator('#alleenIngevuld').check();
    await expect(rijen(page)).toHaveCount(INGEVULD - 1); // Syntrus Achmea staat ingeklapt bij de overige financiers
    await expect(naamCel(page, 'Tellius Hypotheken')).toHaveCount(0);
    await page.locator('#alleenIngevuld').uncheck();
    // filter op "Nog in te vullen"
    await page.locator('#fcrit').selectOption('zzp');
    await page.locator('#fval').selectOption('__leeg__');
    await expect(rijen(page)).toHaveCount(HOOFD - 25);
    // bronnenlijst aanvullende voorwaarden
    await expect(page.locator('#bronnenlijst')).toBeVisible();
    await expect(page.locator('#bronnenlijst')).toContainText('niet door die partijen opgesteld of goedgekeurd');
    await expect(page.locator('#bronnenlijst')).toContainText('Independer (bron niet geverifieerd)');
  });

  test('vergelijken: aanbieders via de matrix, zonder limiet van 4', async ({ page }) => {
    for (const n of ['ABN AMRO', 'Rabobank', 'ING', 'Obvion', 'Florius']) await rij(page, n).locator('input.sel').check();
    await page.locator('#tab-cmp').click();
    await expect(page.locator('#cmpPaneel')).toBeVisible();
    await expect(page.locator('#q')).toBeHidden();
    await expect(page.locator('#vergelijking thead th')).toHaveCount(6);
    await expect(page.locator('#vergelijking tr.grp')).toHaveCount(5);
    await expect(page.locator('#vergelijking')).toContainText('Overbrugging bij verkochte woning');
    expect(page.url()).toContain('#vergelijk=abn-amro,rabobank,ing,obvion,florius');
  });

  test('1 aanbieder × alle kenmerken', async ({ page }) => {
    await page.goto(PAGINA + '#vergelijk=abn-amro');
    await expect(page.locator('#tab-cmp')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#vergelijking thead th')).toHaveCount(2);
    await expect(page.locator('#vergelijking tbody tr[data-crit]')).toHaveCount(VOORWAARDEN);
    await expect(page.locator('#vergelijking')).toContainText('10% van oorspronkelijke hoofdsom per jaar');
    await expect(page.locator('#vergelijking')).toContainText('nog in te vullen');
    // aflossingsvrij: bron en voorbehoud in de tooltip, notitie over ABN AMRO/Florius bij het criterium
    const avrij = page.locator('#vergelijking tr[data-crit="avrij"]');
    await expect(avrij.locator('td.val')).toContainText('max 30% WW');
    await expect(avrij.locator('td.val')).toHaveAttribute('title', /zoekresultaat, pagina zelf niet geopend; controleer bij de geldverstrekker/);
    await expect(avrij.locator('td.crit')).toContainText('Nieuws');
  });

  test('6 aanbieders × 2 kenmerken via de kiezer', async ({ page }) => {
    await page.locator('#tab-cmp').click();
    for (const cat of ['Acceptatie & inkomen', 'Product & rente', 'Verbouwing & verduurzaming', 'Nazorg & beheer', 'Bron']) {
      await page.locator('#kenmChips .chip', { hasText: cat }).click();
    }
    await expect(page.locator('#kenmTeller')).toHaveText(`0 van ${VOORWAARDEN} gekozen`);
    await page.locator('#kenmLijst label', { hasText: 'Boetevrij aflossen' }).locator('input').check();
    await page.locator('#kenmLijst label', { hasText: 'Verhuisregeling' }).locator('input').check();
    for (const n of ['ABN AMRO', 'Rabobank', 'Tulp', 'Venn', 'Argenta', 'Domivest']) {
      await page.locator('#aanbZoek').fill(n);
      await page.locator('#aanbLijst label').first().locator('input').check();
    }
    await expect(page.locator('#aanbTeller')).toHaveText('6 gekozen');
    await expect(page.locator('#vergelijking thead th')).toHaveCount(7);
    await expect(page.locator('#vergelijking tbody tr[data-crit]')).toHaveCount(2);
    expect(decodeURIComponent(page.url())).toContain('&k=boete,verh');
    // horizontaal scrollen binnen het vak op mobiel
    await page.setViewportSize({ width: 390, height: 844 });
    const m = await page.evaluate(() => { const v = document.querySelector('#out .tabelvak'); return { p: document.documentElement.scrollWidth - document.documentElement.clientWidth, v: v.scrollWidth > v.clientWidth }; });
    expect(m.p).toBeLessThanOrEqual(0);
    expect(m.v).toBe(true);
  });

  test('één kenmerk geeft een rangorde op kleurcode', async ({ page }) => {
    await page.goto(PAGINA + '#vergelijk=abn-amro,munt-hypotheken,hypotrust,handelsbanken,centraal-beheer&k=avrij');
    const namen = await page.locator('#ranking tbody tr .vn').allTextContents();
    expect(namen).toEqual(['Handelsbanken', 'Centraal Beheer', 'Munt Hypotheken', 'ABN AMRO', 'Hypotrust']);
    await expect(page.locator('#ranking tbody tr').nth(1)).toContainText('(onzeker)');
    await expect(page.locator('#ranking tbody tr').last()).toContainText('nog in te vullen');
    await page.locator('#optLeeg').check();
    await expect(page.locator('#ranking tbody tr')).toHaveCount(4);
  });

  test('alleen verschillen tonen', async ({ page }) => {
    await page.goto(PAGINA + '#vergelijk=venn-hypotheken,vista-hypotheken');
    await expect(page.locator('#vergelijking tbody tr[data-crit]')).toHaveCount(VOORWAARDEN);
    await page.locator('#optVerschil').check();
    await expect(page.locator('#vergelijking tbody tr[data-crit]')).toHaveCount(2);
    await expect(page.locator('#vergelijking tr[data-crit="duur"]')).toHaveCount(1);
    await expect(page.locator('#vergelijking tr[data-crit="avrij"]')).toHaveCount(1);
    expect(page.url()).toContain('verschil=1');
  });

  test('deeplink herstellen en CSV volgt de selectie', async ({ page }) => {
    await page.goto(PAGINA + '#vergelijk=abn-amro,rabobank&k=boete,verh,avrij');
    await expect(page.locator('#tab-cmp')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#vergelijking thead th')).toHaveCount(3);
    await expect(page.locator('#vergelijking tbody tr[data-crit]')).toHaveCount(3);
    await expect(page.locator('#aanbLijst label', { hasText: 'Rabobank' }).locator('input')).toBeChecked();
    await expect(page.locator('#kenmLijst label', { hasText: 'Verhuisregeling' }).locator('input')).toBeChecked();
    await expect(page.locator('#kenmLijst label', { hasText: 'Erfpacht' }).locator('input')).not.toBeChecked();
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#btnCsv').click()]);
    expect(dl.suggestedFilename()).toBe('voorwaarden-vergelijking.csv');
    const csv = fs.readFileSync(await dl.path(), 'utf8');
    expect(csv.charCodeAt(0)).toBe(0xFEFF);
    const regels = csv.slice(1).split('\r\n');
    expect(regels[0]).toBe('Kenmerk;Categorie;ABN AMRO;Rabobank');
    expect(regels[1]).toBe('Boetevrij aflossen;Product & rente;10% van oorspronkelijke hoofdsom per jaar [Ruim / gunstig];"10% per jaar boetevrij; volledig boetevrij bij verkoop [Ruim / gunstig]"');
    expect(regels.findIndex(r => r.startsWith('Aflossingsvrij;'))).toBe(2);
    expect(csv).toContain('Bevat geen rentes of tarieven');
  });

  test('matrix: kolomkop zet een kenmerk in of uit de vergelijking', async ({ page }) => {
    const knop = page.locator('#matrix thead button.kolomknop').first();
    await expect(knop).toHaveAttribute('aria-pressed', 'true');
    await knop.click();
    await expect(page.locator('#matrix thead button.kolomknop').first()).toHaveAttribute('aria-pressed', 'false');
    expect(page.url()).toContain('#k=flex,');
    expect(page.url()).not.toContain('zzp');
  });

  test('filter op voorwaarde en waarde, en zoeken', async ({ page }) => {
    await page.locator('#fcrit').selectOption('ovbr');
    await expect(page.locator('#fval')).toBeVisible();
    await page.locator('#fval').selectOption('Geen eigen overbruggingskrediet');
    await expect(rijen(page)).toHaveCount(6);
    for (const n of ['Tulp Hypotheken', 'Attens Hypotheken', 'Venn Hypotheken', 'Vista Hypotheken', 'bijBouwe', 'Merius Hypotheken']) await expect(naamCel(page, n)).toHaveCount(1);
    await page.locator('#fcrit').selectOption('');
    await expect(page.locator('#fval')).toBeHidden();
    await page.locator('#q').fill('Triodos');
    await expect(rijen(page)).toHaveCount(1);
    await page.locator('#q').fill('Expats');
    await expect(rijen(page)).toHaveCount(1);
    await expect(naamCel(page, 'Lloyds Bank')).toHaveCount(1);
    // categorie-chip uit: minder kolommen
    await page.locator('#q').fill('');
    await page.locator('#cats .chip', { hasText: 'Bron' }).click();
    await expect(page.locator('#matrix thead th')).toHaveCount(VOORWAARDEN);
  });

  test('beheermodus: cel bewerken komt in de JSON-export', async ({ page }) => {
    await page.locator('#btnEdit').click();
    await expect(page.locator('#beheerbalk')).toBeVisible();
    const cel = rij(page, 'ING').locator('td.val .txt').first();
    await cel.click();
    await page.keyboard.press('ControlOrMeta+a');
    await page.keyboard.type('Testwaarde beheer');
    const tint = rij(page, 'ING').locator('.tintknop').first();
    await tint.click(); // n -> a
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#btnExport').click()]);
    const data = JSON.parse(fs.readFileSync(await dl.path(), 'utf8'));
    const ing = data.geldverstrekkers.find(l => l.naam === 'ING');
    expect(ing.cel.zzp).toEqual({ t: 'a', v: 'Testwaarde beheer' });
    expect(data.voorwaarden.length).toBe(VOORWAARDEN);
    expect(data.geldverstrekkers.length).toBe(TOTAAL);
  });

  test('JSON-import met HTML in een waarde voert niets uit en toont het als tekst', async ({ page }) => {
    const kwaad = '<img src=x onerror=alert(1)>';
    await page.evaluate(() => { window.__xss = 0; });
    const json = {
      versie: 1, peildatum: '<b>okt</b>',
      voorwaarden: [{ id: 'zzp', cat: 'A', naam: kwaad, kort: '' }, { id: 'x"><svg onload=alert(2)>', cat: 'A', naam: 'fout' }],
      geldverstrekkers: [{ naam: kwaad, type: '<script>alert(3)</script>', cel: { zzp: { t: 'g" onclick="alert(4)', v: kwaad } } }]
    };
    await page.locator('#btnEdit').click();
    await page.locator('#imp').setInputFiles({ name: 'x.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(json)) });
    await expect(page.locator('#melding')).toContainText('Dataset geïmporteerd: 1 geldverstrekkers, 1 voorwaarden');
    await page.locator('#btnEdit').click();
    await expect(rijen(page)).toHaveCount(1);
    await expect(page.locator('#out img:not(.plogo), #out svg, #out script')).toHaveCount(0);
    await expect(page.locator('#matrix td.val .txt').first()).toHaveText(kwaad);
    await expect(page.locator('#matrix .vn').first()).toHaveText(kwaad);
    await expect(page.locator('#peil')).toHaveText('<b>okt</b>');
    await page.waitForTimeout(300);
  });

  test('390 px: geen horizontale paginascroll, matrix scrolt binnen eigen vak', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const m = await page.evaluate(() => {
      const v = document.querySelector('.tabelvak');
      return { pagina: document.documentElement.scrollWidth - document.documentElement.clientWidth, vak: v.scrollWidth > v.clientWidth,
        sticky: getComputedStyle(document.querySelector('#matrix tbody th.vast')).position };
    });
    expect(m.pagina).toBeLessThanOrEqual(0);
    expect(m.vak).toBe(true);
    expect(m.sticky).toBe('sticky');
  });

  test('donkere modus: donkere achtergrond en logo op wit', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    const k = await page.evaluate(() => ({
      body: getComputedStyle(document.body).backgroundColor,
      logo: getComputedStyle(document.querySelector('#matrix img.plogo')).backgroundColor,
      cel: getComputedStyle(document.querySelector('#matrix tbody th.vast')).backgroundColor
    }));
    expect(k.body).toBe('rgb(20, 20, 20)');
    expect(k.logo).toBe('rgb(255, 255, 255)');
    expect(k.cel).not.toBe('rgb(255, 255, 255)');
  });

  test('printen opent een eigen venster', async ({ page }) => {
    const [popup] = await Promise.all([page.waitForEvent('popup'), page.locator('#btnPrint').click()]);
    await expect(popup.locator('h1')).toHaveText('Voorwaardenvergelijker geldverstrekkers');
    await expect(popup.locator('.disc')).toContainText('Bevat geen rentes of tarieven');
    await popup.close();
  });
});

test('online gecontroleerde waarden: vinkje, tooltip met bron en controledatum', async ({ page }) => {
  await page.goto('/voorwaarden-vergelijker.html#vergelijk=abn-amro');
  const gec = page.locator('td.val.gec');
  expect(await gec.count()).toBeGreaterThan(5);
  const tip = await gec.first().getAttribute('title');
  expect(tip).toMatch(/Bron: https:\/\//);
  expect(tip).toMatch(/gecontroleerd/);
  await expect(page.locator('#peil')).toContainText('gecontroleerd');
});
