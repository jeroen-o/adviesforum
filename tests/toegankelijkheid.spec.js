// Automatische toegankelijkheidscontrole (axe-core, WCAG 2.1 A/AA) op de voorwaardenpagina's.
// Faalt op ernstige en kritieke bevindingen; kleinere bevindingen staan in de testuitvoer.
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGINAS = [
  ['voorwaarden.html', 'Voorwaarden van aanbieders'],
  ['situatiecheck.html#s=perfp,zzp1', 'Situatiecheck'],
  ['situatiecheck.html#p=orv&s=roker', 'Situatiecheck ORV'],
  ['productvoorwaarden.html#p=orv', 'Productvoorwaarden'],
  ['voorwaarden-vergelijker.html#vergelijk=bunq,ing&k=zzp,erfp', 'Voorwaarden-vergelijker (vergelijken)'],
  ['beheer-voorwaarden.html', 'Datakwaliteit'],
  ['rekentools-blinqx.html', 'Rekentools van Blinqx'],
];

for (const [url, naam] of PAGINAS) {
  test('toegankelijkheid: ' + naam, async ({ page }) => {
    test.setTimeout(60000);
    await page.goto('/' + url);
    await page.waitForLoadState('load');
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    const ernstig = r.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
    const overig = r.violations.filter(v => !ernstig.includes(v));
    if (overig.length) console.log(naam + ': kleinere bevindingen: ' + overig.map(v => v.id + ' (' + v.nodes.length + ')').join(', '));
    expect(ernstig.map(v => v.id + ': ' + v.help + ' – ' + v.nodes.slice(0, 3).map(n => n.target.join(' ')).join(' | '))).toEqual([]);
  });
}
