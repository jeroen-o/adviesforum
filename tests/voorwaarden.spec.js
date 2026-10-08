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
const TOTAAL = 50, HOOFD = 43, OVERIG = 7, VOORWAARDEN = 115, INGEVULD = 32;

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
    await expect(abn.locator('td.val').nth(10).locator('.tint')).toHaveClass(/t-a/); // Erfpacht (na de nieuwe acceptatievoorwaarden)
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
    await expect(page.locator('#vergelijking tr.grp')).toHaveCount(12);
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
    for (const cat of ['Acceptatie & inkomen', 'Inkomen & uitkeringen', 'Ondernemers', 'Financiële verplichtingen', 'Expats', 'Woning & taxatie',
      'Product & rente', 'Offerte & passeren', 'Overbrugging', 'Verbouwing & verduurzaming', 'Nazorg & beheer', 'Bron']) {
      await page.locator('#kenmChips .chip', { hasText: cat }).click();
    }
    await expect(page.locator('#kenmTeller')).toHaveText(`0 van ${VOORWAARDEN} gekozen`);
    await page.locator('#kenmLijst label', { hasText: /^Boetevrij aflossen/i }).locator('input').check();
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
    await expect(page.locator('#ranking tbody tr').nth(1)).toContainText('(nog niet geverifieerd)');
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
  await expect(page.locator('#stempel')).toContainText('gecontroleerd');
});

test.describe('voorwaardenvergelijker: uitgebreid zoeken en filteren', () => {
  let fouten;
  const namen = page => page.locator('#matrix tbody tr[data-id] .vn').allTextContents();
  const openPaneel = async page => {
    await page.locator('#btnUitgebreid').click();
    await expect(page.locator('#btnUitgebreid')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#uitgebreid')).toBeVisible();
  };
  const regel = async (page, i, crit, op, waarde) => {
    await page.locator('#ufRegelPlus').click();
    const r = page.locator('#ufRegels .regel').nth(i);
    await r.locator('select.rc').selectOption(crit);
    await r.locator('select.ro').selectOption(op);
    if (op === 'is') await r.locator('select.rw').selectOption(waarde);
    else await r.locator('input.rw').fill(waarde);
  };
  test.beforeEach(async ({ page }) => {
    fouten = await volgFouten(page);
    page.on('dialog', d => { fouten.push('onverwachte dialog: ' + d.message()); d.dismiss(); });
  });
  test.afterEach(() => { expect(fouten).toEqual([]); });

  test('paneel standaard dicht; meerdere regels met EN en OF, verwijderen en teller', async ({ page }) => {
    await page.goto(PAGINA);
    await expect(page.locator('#uitgebreid')).toBeHidden();
    await expect(page.locator('#btnUitgebreid')).toHaveAttribute('aria-expanded', 'false');
    await openPaneel(page);
    await expect(page.locator('#ufResultaat')).toHaveAttribute('aria-live', 'polite');
    await expect(page.locator('#ufResultaat')).toHaveText(`${TOTAAL} van ${TOTAAL} verstrekkers voldoen`);
    await regel(page, 0, 'ovbr', 'is', 'r');
    await regel(page, 1, 'dag', 'bevat', 'passeren');
    // EN: beperkend overbruggingskrediet én dagrente "passeren"
    await expect(rijen(page)).toHaveCount(6);
    await expect(page.locator('#ufResultaat')).toHaveText(`6 van ${TOTAAL} verstrekkers voldoen`);
    await expect(page.locator('#ufTeller')).toHaveText('2');
    await expect(page.locator('#btnUitgebreid')).toHaveAttribute('aria-label', /2 actieve filters/);
    await expect(naamCel(page, 'Munt Hypotheken')).toHaveCount(0);
    // OF: Munt Hypotheken komt erbij via de tweede regel
    await page.locator('#ufLogica').selectOption('of');
    await expect(rijen(page)).toHaveCount(7);
    await expect(naamCel(page, 'Munt Hypotheken')).toHaveCount(1);
    await expect(page.locator('#ufRegels .regel').nth(1).locator('.rvoeg')).toHaveText('OF');
    // kleurcode-regel "Verhuisregeling = ruim" EN "Boetevrij aflossen bevat verkoop"
    await page.locator('#ufRegels .regel').nth(1).getByRole('button', { name: 'Regel 2 verwijderen' }).click();
    await page.locator('#ufRegels .regel').nth(0).getByRole('button', { name: 'Regel 1 verwijderen' }).click();
    await expect(page.locator('#ufRegels .regel')).toHaveCount(0);
    await expect(page.locator('#ufTeller')).toBeHidden();
    await page.locator('#ufLogica').selectOption('en');
    await regel(page, 0, 'verh', 'is', 'g');
    await expect(rijen(page)).toHaveCount(13);
    const kolV = (await page.locator('#matrix thead th').allTextContents()).findIndex(t => t.includes('Verhuisregeling'));
    const tints = await page.locator('#matrix tbody tr[data-id]').evaluateAll((rs, k) => rs.map(r => r.children[k].querySelector('.tint').className), kolV);
    for (const t of tints) expect(t).toContain('t-g');
    await regel(page, 1, 'boete', 'bevat', 'verkoop');
    expect(await namen(page)).toEqual(['Rabobank']);
    // bevat niet en "nog in te vullen"
    await page.locator('#ufRegels .regel').nth(1).locator('select.ro').selectOption('niet');
    await page.locator('#ufRegels .regel').nth(1).locator('input.rw').fill('verkoop');
    await expect(rijen(page)).toHaveCount(12);
    await expect(naamCel(page, 'Rabobank')).toHaveCount(0);
  });

  test('zoeken: exacte woordgroep, uitsluiten met -woord, EN/OF, zoek in namen en markering', async ({ page }) => {
    await page.goto(PAGINA);
    await openPaneel(page);
    await page.locator('#q').fill('10% per jaar');
    await expect(rijen(page)).toHaveCount(25);
    await page.locator('#q').fill('"10% per jaar"');
    await expect(rijen(page)).toHaveCount(24);
    await expect(naamCel(page, 'ABN AMRO')).toHaveCount(0);
    const mark = page.locator('#matrix td.val mark').first();
    await expect(mark).toHaveText('10% per jaar');
    // uitsluiten
    await page.locator('#q').fill('Hypotheken -Regiepartij');
    expect(await namen(page)).toEqual(['Groene Hart Hypotheken', 'Impact Hypotheken', 'Lot Hypotheken', 'Neo Hypotheken', 'Robuust Hypotheken', 'Tellius Hypotheken']);
    await page.locator('#q').fill('"Overbrugging" -Geen');
    await expect(rijen(page)).toHaveCount(9);
    await expect(naamCel(page, 'Tulp Hypotheken')).toHaveCount(0);
    // OF tussen woorden
    await page.locator('#q').fill('Triodos Knab');
    await expect(rijen(page)).toHaveCount(0);
    await expect(page.locator('#geenResultaat')).toContainText('Geen verstrekkers gevonden');
    await page.locator('#ufModus').selectOption('of');
    expect(await namen(page)).toEqual(['Triodos Bank', 'Knab']);
    await expect(page.locator('#matrix .vn mark')).toHaveCount(2);
    // alleen in namen: waarde-treffers tellen niet
    await page.locator('#ufModus').selectOption('en');
    await page.locator('#q').fill('Expats');
    await expect(rijen(page)).toHaveCount(1);
    await page.locator('#ufIn').selectOption('n');
    await expect(rijen(page)).toHaveCount(0);
    // lege uitkomst met wis-knop
    await page.locator('#leegWis').click();
    await expect(rijen(page)).toHaveCount(HOOFD);
    await expect(page.locator('#q')).toHaveValue('');
    await expect(page.locator('#ufIn')).toHaveValue('nw');
    // geen HTML via de zoekterm
    await page.locator('#q').fill('<img src=x onerror=alert(1)>');
    await expect(page.locator('#out img:not(.plogo)')).toHaveCount(0);
  });

  test('snelfilters: type, nieuwe klanten verbergen en overige financiers', async ({ page }) => {
    await page.goto(PAGINA);
    await openPaneel(page);
    await page.locator('#ufTypes [data-type="verz"]').click();
    expect(await namen(page)).toEqual(['Aegon', 'Nationale-Nederlanden', 'a.s.r.', 'Centraal Beheer', 'Allianz']);
    await page.locator('#ufTypes [data-type="label"]').click();
    await expect(page.locator('#ufTypes [data-type="label"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(rijen(page)).toHaveCount(7);
    await page.locator('#ufWis').click();
    await expect(rijen(page)).toHaveCount(HOOFD);
    await page.locator('#ufGeenNieuw').check();
    await expect(rijen(page)).toHaveCount(HOOFD - 4);
    for (const n of ['Neo Hypotheken', 'Woonnu', 'Tellius Hypotheken', 'IQWOON']) await expect(naamCel(page, n)).toHaveCount(0);
    await page.locator('#ufOverig').check();
    await expect(page.locator('#overigKnop')).toHaveAttribute('aria-expanded', 'true');
    await expect(rijen(page)).toHaveCount(TOTAAL - 4);
  });

  test('sorteren: naam, meeste ruim en minste beperkingen', async ({ page }) => {
    await page.goto(PAGINA);
    await openPaneel(page);
    await page.locator('#ufSort').selectOption('naam');
    const n = await namen(page);
    expect(n).toEqual([...n].sort((a, b) => a.localeCompare(b, 'nl')));
    const tel = cls => page.locator('#matrix tbody tr[data-id]').evaluateAll((rs, c) => rs.map(r => r.querySelectorAll('td.val .tint.' + c).length), cls);
    await page.locator('#ufSort').selectOption('ruim');
    const g = await tel('t-g');
    expect(g).toEqual([...g].sort((a, b) => b - a));
    expect(g[0]).toBeGreaterThan(0);
    await page.locator('#ufSort').selectOption('beperk');
    const r = await tel('t-r');
    expect(r).toEqual([...r].sort((a, b) => a - b));
    // op de voorwaarden uit de regels: dan telt alleen die kolom
    await regel(page, 0, 'ovbr', 'bevat', 'o');
    await page.locator('#ufSort').selectOption('ruim');
    const kol = 1 + (await page.locator('#matrix thead th').allTextContents()).findIndex(t => t.includes('Overbruggingskrediet'));
    const ruim = await page.locator('#matrix tbody tr[data-id]').evaluateAll((rs, k) => rs.map(x => x.children[k].querySelector('.tint').classList.contains('t-g') ? 1 : 0), kol);
    expect(ruim).toEqual([...ruim].sort((a, b) => b - a));
  });

  test('deeplink: filters in de hash en herstellen bij laden', async ({ page }) => {
    await page.goto(PAGINA);
    await openPaneel(page);
    await page.locator('#q').fill('Hypotheken');
    await page.locator('#ufIn').selectOption('n');
    await page.locator('#ufTypes [data-type="regie"]').click();
    await page.locator('#ufGeenNieuw').check();
    await page.locator('#ufSort').selectOption('naam');
    await regel(page, 0, 'rmid', 'bevat', 'mogelijk, ook; "x"/y');
    await page.locator('#ufRegels .regel').nth(0).locator('select.ro').selectOption('niet');
    await page.locator('#ufRegels .regel').nth(0).locator('input.rw').fill('mogelijk, ook; "x"/y');
    const verwacht = await namen(page);
    expect(verwacht.length).toBe(10);
    const url = page.url();
    expect(url).toContain('#f=q:Hypotheken;in:n;r:rmid,niet,');
    expect(url).toContain(';t:regie;x:1;s:naam');
    await page.goto('about:blank');
    await page.goto(url);
    await expect(page.locator('#uitgebreid')).toBeHidden();
    await expect(page.locator('#ufTeller')).toHaveText('4');
    expect(await namen(page)).toEqual(verwacht);
    await expect(page.locator('#q')).toHaveValue('Hypotheken');
    await expect(page.locator('#ufSort')).toHaveValue('naam');
    await expect(page.locator('#ufIn')).toHaveValue('n');
    await expect(page.locator('#ufGeenNieuw')).toBeChecked();
    await expect(page.locator('#ufTypes [data-type="regie"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#ufRegels input.rw')).toHaveValue('mogelijk, ook; "x"/y');
    await expect(page.locator('#ufRegels select.ro')).toHaveValue('niet');
    // samen met een vergelijking, en onzin in de hash breekt niets
    await page.goto('about:blank');
    await page.goto(PAGINA + '#vergelijk=abn-amro&f=q:Rabo;r:bestaatniet,is,g/verh,xx,1/verh,is,zz;n:abc;s:raar;t:bank.nep');
    await expect(page.locator('#tab-cmp')).toHaveAttribute('aria-selected', 'true');
    await page.locator('#tab-matrix').click();
    await expect(page.locator('#ufRegels .regel')).toHaveCount(1);
    await expect(page.locator('#ufRegels .regel select.rw')).toHaveValue('g');
    expect(await namen(page)).toEqual(['Rabobank']);
  });

  test('vergelijk deze resultaten en CSV volgt het filter', async ({ page }) => {
    await page.goto(PAGINA);
    await openPaneel(page);
    await regel(page, 0, 'ovbr', 'is', 'r');
    await page.locator('#ufSort').selectOption('naam');
    const [dl] = await Promise.all([page.waitForEvent('download'), page.locator('#btnCsv').click()]);
    const csv = fs.readFileSync(await dl.path(), 'utf8').slice(1).split('\r\n');
    expect(csv.slice(1, 7).map(r => r.split(';')[0])).toEqual(['Attens Hypotheken', 'bijBouwe', 'Merius Hypotheken', 'Tulp Hypotheken', 'Venn Hypotheken', 'Vista Hypotheken']);
    expect(csv.some(r => r.startsWith('Gefilterd: regels: Overbruggingskrediet is kleurcode beperkend'))).toBe(true);
    await page.locator('#ufVergelijk').click();
    await expect(page.locator('#tab-cmp')).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#vergelijking thead th')).toHaveCount(7);
    await expect(page.locator('#aanbTeller')).toHaveText('6 gekozen');
    await expect(page.locator('#melding')).toContainText('6 gefilterde verstrekkers');
    expect(page.url()).toContain('#vergelijk=tulp-hypotheken,attens-hypotheken,venn-hypotheken,vista-hypotheken,bijbouwe,merius-hypotheken');
    expect(page.url()).toContain('&f=r:ovbr,is,r');
  });

  test('390 px: paneel met regels zonder horizontale paginascroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGINA);
    await openPaneel(page);
    await regel(page, 0, 'rmid', 'bevat', 'mogelijk');
    await regel(page, 1, 'verh', 'is', 'g');
    await page.locator('#ufTypes [data-type="bank"]').click();
    const breed = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(breed).toBeLessThanOrEqual(0);
    await page.emulateMedia({ colorScheme: 'dark' });
    const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.ufblok')).backgroundColor);
    expect(bg).toBe('rgb(30, 30, 30)');
  });
});

test.describe('voorwaardenvergelijker: filters op geverifieerde waarden', () => {
  let fouten;
  test.beforeEach(async ({ page }) => {
    fouten = await volgFouten(page);
    await page.goto('/voorwaarden-vergelijker.html');
    await page.locator('#btnUitgebreid').click();
  });
  test.afterEach(() => { expect(fouten).toEqual([]); });

  test('alleen geverifieerde waarden dimt de rest; minimum aantal geverifieerd', async ({ page }) => {
    await page.locator('#ufAlleenGev').check();
    const gedimd = page.locator('#matrix td.val.gedimd');
    expect(await gedimd.count()).toBeGreaterThan(0);
    await expect(page.locator('#matrix td.val.gedimd.gec')).toHaveCount(0);
    expect(await page.locator('#matrix td.val.gec').count()).toBeGreaterThan(0);
    await page.locator('#ufAlleenGev').uncheck();
    await expect(gedimd).toHaveCount(0);
    await page.locator('#ufMinGev').fill('15');
    const n = await page.locator('#matrix tbody tr[data-id]').count();
    expect(n).toBeGreaterThan(0);
    expect(n).toBeLessThan(43);
    const per = await page.locator('#matrix tbody tr[data-id]').evaluateAll(rs => rs.map(r => r.querySelectorAll('td.val.gec').length));
    for (const x of per) expect(x).toBeGreaterThanOrEqual(15);
    expect(page.url()).toContain('f=n:15');
    // sorteren op meeste geverifieerde waarden
    await page.locator('#ufMinGev').fill('0');
    await page.locator('#ufSort').selectOption('gev');
    const gev = await page.locator('#matrix tbody tr[data-id]').evaluateAll(rs => rs.map(r => r.querySelectorAll('td.val.gec').length));
    expect(gev).toEqual([...gev].sort((a, b) => b - a));
  });

  test("'nog niet geverifieerd' verbergen", async ({ page }) => {
    const nv = page.locator('#matrix td.val.nv');
    const aantal = await nv.count();
    expect(aantal).toBeGreaterThan(0);
    await page.locator('#ufNvTonen').uncheck();
    await expect(nv).toHaveCount(0);
    await expect(page.locator('#matrix .verborgen')).toHaveCount(aantal);
    await expect(page.locator('#matrix td.val', { hasText: '(nog niet geverifieerd)' }).filter({ hasNot: page.locator('.verborgen') })).toHaveCount(0);
    expect(page.url()).toContain('nv:0');
    await page.locator('#ufWis').click();
    await expect(nv).toHaveCount(aantal);
  });
});

test('knop Meest gezocht kiest de veelgezochte voorwaarden (meest gezocht eerst)', async ({ page }) => {
  await page.goto('/voorwaarden-vergelijker.html');
  await page.locator('#tab-cmp').click();
  const knop = page.locator('#kenmChips button', { hasText: 'Meest gezocht' });
  await knop.click();
  await expect(knop).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#kenmTeller')).toHaveText(/^20 van 115 gekozen$/);
  await expect(page).toHaveURL(/[#&]k=[^&]*obmax/);
  await expect(page).toHaveURL(/[#&]k=[^&]*cons/);
});
