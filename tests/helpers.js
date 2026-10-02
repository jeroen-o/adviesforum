// Gedeelde hulpfuncties: JS-fouten verzamelen en externe diensten afvangen.
const PAGINAS = ['index.html', 'aanmelden.html', 'privacy.html', 'leennormen-2026.html', 'bijleenregeling.html',
  'overbrugging.html', 'maandlasten.html', 'wetgeving.html', 'werkinstructie-financieringsopzet.html'];

async function volgFouten(page) {
  const fouten = [];
  page.on('pageerror', e => fouten.push(e.message));
  // FormSubmit nooit echt aanroepen in tests
  await page.route('https://formsubmit.co/**', route => {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Accept' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: '{"success":"true"}' });
  });
  return fouten;
}
module.exports = { PAGINAS, volgFouten };
