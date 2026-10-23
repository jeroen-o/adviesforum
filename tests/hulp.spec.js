// Prototype hulppaneel (hulp.html): context uit de URL, zelfbediening met bron, doorzetten zonder klantgegevens.
const { test, expect } = require('@playwright/test');

test('context uit de link, zelfbediening met bronvermelding en vergelijkbare vragen', async ({ page }) => {
  const fouten = []; page.on('pageerror', e => fouten.push(e.message));
  await page.goto('/hulp.html?scherm=Adviseren%20%E2%80%BA%20Hypotheek%20samenstellen&veld=Geldverstrekker&versie=2.7');
  await expect(page.locator('#chips')).toContainText('Hypotheek samenstellen');
  await expect(page.locator('#chips')).toContainText('Veld: Geldverstrekker');
  await expect(page.locator('#chips')).toContainText('Versie 2.7');
  await expect(page.getByText('Ingevulde dossiergegevens worden niet meegestuurd')).toBeVisible();
  await page.fill('#vraag', 'Hoe reken je het maximale overbruggingskrediet bij een nog niet verkochte woning?');
  await page.getByRole('button', { name: 'Zoek een antwoord' }).click();
  await expect(page.locator('#s-antwoord')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('#herformulering')).toContainText(/Bedoel je|Je vraag/);
  await expect(page.locator('#kb-antwoord')).toContainText('Antwoord uit de kennisbank');
  await expect(page.locator('#kb-antwoord .bron')).toContainText('Bron:');
  await expect(page.locator('#vergelijk li').first()).toBeVisible();
  expect(fouten).toEqual([]);
});

test('niet opgelost: klantgegevens uit de forumtekst, routering en status', async ({ page }) => {
  await page.goto('/hulp.html');
  const tekst = 'Klant jan@voorbeeld.nl met IBAN NL91ABNA0417164300 wil de woning alleen houden na scheiding; welke toets geldt dan voor de partner?';
  await page.fill('#vraag', tekst);
  await expect(page.locator('#pii')).toContainText('e-mailadres');
  await expect(page.locator('#pii')).toContainText('IBAN');
  await page.getByRole('button', { name: 'Zoek een antwoord' }).click();
  await expect(page.locator('#s-antwoord')).toBeVisible({ timeout: 20000 });
  await page.getByRole('button', { name: 'Niet opgelost' }).click();
  const preview = await page.locator('#preview').textContent();
  expect(preview).toContain('[verwijderd]');
  expect(preview).not.toContain('jan@voorbeeld.nl');
  expect(preview).not.toContain('NL91ABNA');
  await page.getByLabel(/De werking van de software/).check();
  await page.getByRole('button', { name: 'Doorzetten' }).click();
  await expect(page.locator('#support-blok')).toBeVisible();
  await expect(page.locator('#support-blok')).toContainText('Intercom-ticket [nummer]');
  await expect(page.locator('#stappen')).toContainText('Bij support');
});

test('de pagina is niet indexeerbaar en heeft het toegangsscherm niet nodig met cookie', async ({ page, request }) => {
  const html = await (await request.get('/hulp.html')).text();
  expect(html).toMatch(/<meta name="robots" content="noindex, nofollow">/);
  await page.goto('/hulp.html');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});
