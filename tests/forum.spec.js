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
  expect(mail).toMatch(/^mailto:forumadvies@gmail\.com\?subject=Nieuwe vraag Adviesforum: Overbrugging/);
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
  expect(mail).toMatch(/^mailto:forumadvies@gmail\.com\?subject=Aanmelding adviseur: Sanne de Vries/);
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
