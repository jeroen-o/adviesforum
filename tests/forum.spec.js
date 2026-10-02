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
  let verstuurd = null;
  await page.route('https://formsubmit.co/**', route => {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Accept' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    verstuurd = JSON.parse(route.request().postData());
    return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: '{"success":"true"}' });
  });
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
  await expect(page.locator('.notice.ok')).toContainText('naar de beheerder gestuurd');
  expect(verstuurd.Telefoonnummer).toBe('0612345678');
  expect(verstuurd.LinkedIn).toBe('https://linkedin.com/in/testadviseur');
  // automatisch antwoord zonder AI vindt de rekenhulp
  await expect(page.locator('.auto')).toContainText('geen AI');
  await expect(page.locator('.auto')).toContainText('Overbruggingskrediet');
});

test('aanmeldformulier verstuurt naar FormSubmit', async ({ page }) => {
  await volgFouten(page);
  await page.goto('/aanmelden.html');
  await page.fill('#voornaam', 'Sanne'); await page.fill('#achternaam', 'de Vries');
  await page.fill('#email', 'sanne@kantoor.nl'); await page.fill('#telefoon', '06 12 34 56 78');
  await page.fill('#bedrijf', 'Hypotheekhuis'); await page.selectOption('#functie', 'Hypotheekadviseur');
  await page.fill('#linkedin', 'https://www.linkedin.com/in/sannedevries'); await page.check('#akkoord');
  await page.click('#verstuur');
  await expect(page.locator('#succes')).toBeVisible();
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
