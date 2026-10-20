// Spraakinvoer bij "Stel een vraag": alleen zichtbaar als de browser spraakherkenning heeft; de tekst komt in het veld en blijft te bewerken.
const { test, expect } = require('@playwright/test');

const NEP = () => {
  window.SpeechRecognition = window.webkitSpeechRecognition = class {
    start() { this.onstart && this.onstart(); setTimeout(() => this.onresult && this.onresult({ resultIndex: 0, results: [Object.assign([{ transcript: 'hoe reken je de overbrugging bij een nog niet verkochte woning' }], { isFinal: true })] }), 50); }
    stop() { this.onend && this.onend(); }
  };
};

test('spraakknop zet gesproken tekst in het vraagveld', async ({ page }) => {
  await page.addInitScript(NEP);
  await page.goto('/index.html');
  await page.click('#sitenav-acties [data-act="nieuw"]');
  const knop = page.getByRole('button', { name: /Spreek je vraag in/ });
  await expect(knop).toBeVisible();
  await knop.click();
  await expect(page.locator('#nv-body')).toHaveValue(/Hoe reken je de overbrugging/);
  await expect(page.locator('.hint', { hasText: 'geluid naar de aanbieder van je browser' })).toBeVisible();
  await page.getByRole('button', { name: /Stop opname/ }).click();
  await expect(page.getByRole('button', { name: /Spreek je vraag in/ })).toHaveAttribute('aria-pressed', 'false');
});

test('zonder spraakherkenning in de browser is er geen spraakknop', async ({ page }) => {
  await page.addInitScript(() => { delete window.SpeechRecognition; delete window.webkitSpeechRecognition; });
  await page.goto('/index.html');
  await page.click('#sitenav-acties [data-act="nieuw"]');
  await expect(page.locator('#nv-body')).toBeVisible();
  await expect(page.getByRole('button', { name: /Spreek je vraag in/ })).toHaveCount(0);
});
