// Gedeelde hulpfuncties: JS-fouten verzamelen en externe diensten afvangen.
const PAGINAS = ['index.html', 'aanmelden.html', 'privacy.html', 'leennormen-2026.html', 'bijleenregeling.html',
  'overbrugging.html', 'maandlasten.html', 'oversluiten.html', 'kosten-koper.html', 'ltv.html',
  'restschuld-pensioen.html', 'extra-aflossen.html', 'rentemiddeling.html', 'erfpacht.html', 'draagplicht.html', 'orv.html', 'aov-tekort.html', 'inkomen-ziekte-werknemer.html', 'werkloosheid.html', 'herbouwwaarde.html', 'wetgeving.html', 'werkinstructie-financieringsopzet.html', 'partijen.html', 'rekentools.html', 'sjablonen.html', 'kalender.html', 'levensgebeurtenissen.html', 'nieuw.html', 'compliance-overzicht.html', 'adviesroute.html', 'vergelijken.html', 'klantuitleg.html', 'oefenen.html', 'nhg-check.html', 'nhg-beheertoets.html', 'wwft-cdd.html', 'nazorg-signalen.html', 'inkomensbepaling.html', 'adviesmotivatie.html',
  'inventarisatie.html', 'documentenchecklist.html', 'afwijkend-advies.html', 'gespreksverslag.html', 'nazorg-check.html', 'wijziging-doorgeven.html',
  'scan-nazorg-jaarlijks.html', 'scan-hypotheek.html', 'scan-aflossingsvrij.html', 'scan-overlijdensrisico.html', 'scan-pensioen.html', 'scan-schadeverzekeringen.html', 'scan-autoverzekering.html', 'scan-bedrijfsverzekeringen.html', 'scan-uitvaart.html', 'scan-klanttevredenheid.html'];

async function volgFouten(page) {
  const fouten = [];
  page.on('pageerror', e => fouten.push(e.message));
  // Geen enkele externe formulierdienst mag worden aangeroepen
  await page.route('https://formsubmit.co/**', route => {
    const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Accept' };
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    return route.fulfill({ status: 200, headers: { ...cors, 'Content-Type': 'application/json' }, body: '{"success":"true"}' });
  });
  return fouten;
}
module.exports = { PAGINAS, volgFouten };
