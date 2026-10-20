// Toegangswoord (js/toegang.js): zonder cookie een scherm voor het woord, hoofdletters maken niet uit, daarna onthouden in af_toegang.
const { test, expect } = require('@playwright/test');
test.use({ storageState: { cookies: [], origins: [] } });

test('zonder toegangswoord is de pagina afgeschermd; een fout woord opent niet', async ({ page }) => {
  await page.goto('/index.html');
  const dialoog = page.getByRole('dialog');
  await expect(dialoog).toBeVisible();
  await page.getByLabel('Toegangswoord').fill('fout');
  await page.getByRole('button', { name: 'Openen' }).click();
  await expect(page.getByRole('alert')).toContainText('klopt niet');
  await expect(dialoog).toBeVisible();
  expect((await page.context().cookies()).some(c => c.name === 'af_toegang')).toBe(false);
});

for (const woord of ['dennes', 'DENNES', ' Dennes ']) {
  test('het woord "' + woord + '" opent de site en wordt onthouden', async ({ page }) => {
    await page.goto('/voorwaarden.html');
    await page.getByLabel('Toegangswoord').fill(woord);
    await page.getByRole('button', { name: 'Openen' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    const c = (await page.context().cookies()).find(x => x.name === 'af_toegang');
    expect(c && c.value).toBe('1');
    expect(JSON.stringify(await page.context().cookies())).not.toContain('dennes');
    await page.goto('/privacy.html');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
}

test('het toegangswoord staat niet leesbaar in de broncode', async ({ request }) => {
  const js = await (await request.get('/js/toegang.js')).text();
  expect(js.toLowerCase()).not.toMatch(/['"]dennes['"]/);
});
