// Nieuwe vraag: categorie Fastlane / eBlinqx Hypotheekadvies en gelijksoortige vragen tijdens het typen (niet blokkerend).
const { test, expect } = require('@playwright/test');

test('categorie Fastlane / eBlinqx Hypotheekadvies staat tussen Hypotheken en Verzekeringen', async ({ page }) => {
  await page.goto('/index.html');
  await page.click('#sitenav-acties [data-act="nieuw"]');
  const opties = await page.locator('#nv-cat option').allTextContents();
  expect(opties.indexOf('Fastlane / eBlinqx Hypotheekadvies')).toBe(opties.indexOf('Hypotheken') + 1);
  expect(opties.indexOf('Verzekeringen')).toBe(opties.indexOf('Hypotheken') + 2);
});

test('tijdens het typen verschijnen mogelijk al beantwoorde vragen, en plaatsen blijft kunnen', async ({ page }) => {
  await page.goto('/index.html');
  await page.click('#sitenav-acties [data-act="nieuw"]');
  await page.fill('#nv-titel', 'Overbrugging bij nog niet verkochte woning: hoe bereken je het maximale overbruggingskrediet?');
  const vak = page.locator('#nv-gelijk');
  await expect(vak).toContainText('Wellicht is jouw vraag al beantwoord', { timeout: 15000 });
  await expect(vak.locator('a').first()).toHaveAttribute('target', '_blank');
  await expect(page.locator('#f-vraag button[type="submit"]')).toBeEnabled();
});

test('bij een heel korte tekst verschijnt er niets', async ({ page }) => {
  await page.goto('/index.html');
  await page.click('#sitenav-acties [data-act="nieuw"]');
  await page.fill('#nv-titel', 'NHG');
  await expect(page.locator('#nv-gelijk')).toBeEmpty();
});
