const { test, expect } = require('@playwright/test');
const { volgFouten } = require('./helpers');

test('tabbladen en directe links werken', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html#artikel-k10');
  await expect(page.locator('h1')).toContainText('Leennormen 2026');
  for (const tab of ['faq', 'hulpmiddelen', 'begrippen', 'kennisbank', 'forum']) {
    await page.click(`.tab[data-tab="${tab}"]`);
    await expect(page).toHaveURL(new RegExp('#' + tab + '$'));
  }
  expect(fouten).toEqual([]);
});

test('houdbaarheid: na de herzieningsdatum staat er "mogelijk verouderd"', async ({ page }) => {
  await volgFouten(page);
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00'));
  await page.goto('/index.html#artikel-k10');
  await expect(page.locator('.notice.err')).toContainText('Mogelijk verouderd');
});

test('vraag stellen vraagt contactgegevens en toont alleen de naam', async ({ page }) => {
  await volgFouten(page);
  await page.goto('/index.html');
  await page.click('header [data-act="nieuw"]');
  await page.fill('#nv-titel', 'Overbrugging bij nog niet verkochte woning: hoeveel?');
  await page.fill('#nv-body', 'Klant koopt eerst en verkoopt later. Hoe bepalen jullie het maximale overbruggingskrediet?');
  await page.fill('#nv-naam', 'Test Adviseur');
  await page.fill('#nv-email', 'test@kantoor.nl');
  await page.fill('#nv-tel', '0612345678');
  await page.fill('#nv-li', 'linkedin.com/in/testadviseur?utm_source=x');
  await page.check('input[name="akkoord"]');
  await page.click('#f-vraag button[type="submit"]');
  await expect(page.locator('.qhead h1')).toContainText('Overbrugging');
  await expect(page.locator('.byline').first()).toContainText('Test Adviseur');
  await expect(page.locator('main')).not.toContainText('0612345678');
  await expect(page.locator('main')).not.toContainText('test@kantoor.nl');
  await expect(page.locator('.notice.ok')).toContainText('Verzenden');
  const mail = decodeURIComponent(await page.getAttribute('#mail-opnieuw', 'href'));
  expect(mail).toMatch(/^mailto:jeroen@oversteegen\.nl\?subject=Nieuwe vraag Adviesforum: Overbrugging/);
  expect(mail).toContain('Telefoonnummer: 0612345678');
  expect(mail).toContain('LinkedIn: https://linkedin.com/in/testadviseur');
  // automatisch antwoord zonder AI vindt de rekenhulp
  await expect(page.locator('.auto')).toContainText('geen AI');
  await expect(page.locator('.auto')).toContainText('Overbruggingskrediet');
});

test('aanmeldformulier zet een e-mail klaar voor de beheerder', async ({ page }) => {
  await volgFouten(page);
  await page.goto('/aanmelden.html');
  await page.fill('#voornaam', 'Sanne'); await page.fill('#achternaam', 'de Vries');
  await page.fill('#email', 'sanne@kantoor.nl'); await page.fill('#telefoon', '06 12 34 56 78');
  await page.fill('#bedrijf', 'Hypotheekhuis'); await page.selectOption('#functie', 'Hypotheekadviseur');
  await page.fill('#linkedin', 'https://www.linkedin.com/in/sannedevries'); await page.check('#akkoord');
  await page.click('#verstuur');
  await expect(page.locator('#succes')).toBeVisible();
  const mail = decodeURIComponent(await page.getAttribute('#mail-opnieuw', 'href'));
  expect(mail).toMatch(/^mailto:jeroen@oversteegen\.nl\?subject=Aanmelding adviseur: Sanne de Vries/);
  expect(mail).toContain('═══ 1. CONTACT ═══');
  expect(mail).toContain('Telefoonnummer: 06 12 34 56 78');
});

test('mobiel: alle tabbladen zonder horizontale scroll en volle formuliervelden', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const h of ['', '#kennisbank', '#faq', '#hulpmiddelen', '#begrippen', '#adviseurs', '#handleiding', '#voorwie', '#artikel-k10']) {
    await page.goto('/index.html' + h);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(392);
  }
  await page.click('header [data-act="nieuw"]');
  const smal = await page.$$eval('#f-vraag input:not([type=checkbox]), #f-vraag textarea, #f-vraag select', els => els.filter(e => e.getBoundingClientRect().width < 250).map(e => e.name));
  expect(smal).toEqual([]);
  expect(fouten).toEqual([]);
});

test('inloggen adviseur: zonder code geen antwoordformulier, met cookie of code wel', async ({ page, context }) => {
  const fouten = await volgFouten(page);
  // testaccount met bekende code, alleen in deze test
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ADVISEURS', { configurable: true, set(v) { v.push({ id: 'ut', naam: 'Test Adviseur', functie: 'Hypotheekadviseur', kantoor: 'Test', rol: 'adviseur', geverifieerd: true, codeHash: 'f92f4f7f69213b390959cf2f9c2bacdc83267e2e6538089342664fb2791927f7' }); this._a = v; }, get() { return this._a; } });
  });
  await page.goto('/index.html#vraag-v13');
  await expect(page.locator('#f-antwoord')).toHaveCount(0);
  await expect(page.locator('#who')).toContainText('Inloggen');
  await page.click('#who [data-act="inloggen"]');
  await page.fill('#lg-code', 'AAAA-BBBB-CCCC');
  await page.click('#f-login button[type="submit"]');
  await expect(page.locator('#toast')).toContainText('niet bekend');
  await page.fill('#lg-code', 'test code 1234');
  await page.check('#f-login input[name="onthoud"]');
  await page.click('#f-login button[type="submit"]');
  await expect(page.locator('#who')).toContainText('Test Adviseur');
  await expect(page.locator('#f-antwoord')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('#who')).toContainText('Test Adviseur');
  await page.click('#who [data-act="uitloggen"]');
  await expect(page.locator('#f-antwoord')).toHaveCount(0);
  // inloglink
  await page.goto('/index.html#login-TEST-CODE-1234');
  await expect(page.locator('#who')).toContainText('Test Adviseur');
  expect(page.url()).not.toContain('login-');
  expect(fouten).toEqual([]);
});

test('voorbeeldadviseurs tonen "Voorbeeldprofiel" in plaats van "Geverifieerd"; echte adviseurs blijven geverifieerd', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'ADVISEURS', { configurable: true, set(v) { v.push({ id: 'ut', naam: 'Echte Adviseur', functie: 'Hypotheekadviseur', kantoor: 'Test', rol: 'adviseur', geverifieerd: true, codeHash: 'x' }); this._a = v; }, get() { return this._a; } });
  });
  await page.goto('/index.html#adviseurs');
  await expect(page.locator('#demo-melding')).toContainText('Voorbeelddata');
  await expect(page.locator('.tbl thead')).toContainText('Score antwoord');
  await expect(page.locator('.tbl tr', { hasText: 'Sanne de Vries' })).toContainText('Voorbeeldprofiel');
  await expect(page.locator('.tbl tr', { hasText: 'Sanne de Vries' })).not.toContainText('Geverifieerd');
  await expect(page.locator('.tbl tr', { hasText: 'Echte Adviseur' })).toContainText('✓ Geverifieerd');
  await page.goto('/index.html#vraag-v2');
  await expect(page.locator('main')).toContainText('Voorbeeldprofiel');
  await expect(page.locator('main')).not.toContainText('Geverifieerd');
  await expect(page).toHaveTitle(/ – Adviesforum$/);
  expect(fouten).toEqual([]);
});

test('zoeken: "nhg grens" vindt resultaten (woorden, synoniemen, leestekens) en toont "Ook gevonden in"', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.goto('/index.html');
  await page.fill('.sitenav-zoek input', 'nhg grens');
  await expect(page.locator('#app .q').first()).toBeVisible();
  const rij = page.locator('.ook');
  await expect(rij).toContainText('Ook gevonden in');
  for (const n of ['Forum', 'Kennisbank', 'FAQ', 'Begrippen', 'Hulpmiddelen']) await expect(rij).toContainText(n + ' (');
  await expect(rij).toContainText(/FAQ \([1-9]/);
  await page.click('.ook button[data-tab="kennisbank"]');
  await expect(page).toHaveURL(/#kennisbank$/);
  await expect(page.locator('#app h1')).toHaveText('Kennisbank');
  await expect(page.locator('.sitenav-zoek input')).toHaveValue('nhg grens');
  await expect(page.locator('#app .art').first()).toBeVisible();
  await page.click('.ook button[data-tab="faq"]');
  await expect(page.locator('#app details.term').first()).toBeVisible();
  // accenten en streepjes maken niet uit
  await page.fill('.sitenav-zoek input', 'NHG-grens');
  await expect(page.locator('#app details.term').first()).toBeVisible();
  expect(fouten).toEqual([]);
});

test('mobiel: geen horizontale scroll bij een zoekterm zonder resultaten', async ({ page }) => {
  const fouten = await volgFouten(page);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const h of ['', '#kennisbank', '#faq', '#hulpmiddelen', '#begrippen']) {
    await page.goto('/index.html' + h);
    await page.fill('.sitenav-zoek input', 'xyzqqq geen resultaat');
    await expect(page.locator('.ook')).toBeVisible();
    await expect(page.locator('#app .empty').first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(392);
  }
  expect(fouten).toEqual([]);
});
