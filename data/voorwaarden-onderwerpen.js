/* Koppeling kennisbank en forumvragen -> voorwaarden-vergelijker.
 * Bij een hypotheekvraag of -artikel waarin een onderwerp voorkomt, verschijnt een link naar de bijbehorende
 * kolom(men) in voorwaarden-vergelijker.html (#k=<criterium-id's>). Gebruikt door index.html en tools/build-static.js.
 * Alleen categorieën in CATS; maximaal MAX links per item, in de volgorde waarin de onderwerpen hieronder staan. */
window.VOORWAARDEN_ONDERWERPEN = {
  CATS: ['hyp', 'fisc'],
  MAX: 3,
  lijst: [
    { naam: 'perspectiefverklaring', k: ['persp', 'flex'], re: /perspectiefverklaring/i },
    { naam: 'zzp en ondernemers', k: ['zzp'], re: /\bzzp|zelfstandig ondernemer|\bondernemer|\bdga\b|jaarcijfers|inkomensverklaring ondernemer/i },
    { naam: 'flexibel inkomen', k: ['flex', 'persp'], re: /flexibel inkomen|flexwerk|uitzendkracht|uitzendwerk|oproepkracht|tijdelijk contract|zonder vast contract/i },
    { naam: 'erfpacht', k: ['erfp'], re: /erfpacht/i },
    { naam: 'inkomen na AOW', k: ['aow'], re: /\baow\b|pensioeninkomen|naderend pensioen|senioren?hypotheek/i },
    { naam: 'aflossingsvrij', k: ['avrij', 'avlt'], re: /aflossingsvrij/i },
    { naam: 'rentemiddeling', k: ['rmid'], re: /rentemiddeling/i },
    { naam: 'verhuisregeling', k: ['verh'], re: /verhuisregeling|meeneemregeling|rente meenemen/i },
    { naam: 'overbrugging', k: ['ovbr'], re: /overbrugging/i },
    { naam: 'bouwdepot', k: ['bdduur', 'bdrnt', 'bddecl'], re: /bouwdepot/i },
    { naam: 'verduurzaming', k: ['ebb', 'duur', 'o106', 'elbl'], re: /energiebespaarbudget|energiebesparende|verduurzam|energielabel|106\s?%/i },
    { naam: 'boetevrij aflossen', k: ['boete', 'bbrk'], re: /boetevrij|extra aflossen|boeterente|vergoeding bij aflossen/i },
    { naam: 'ontslag hoofdelijke aansprakelijkheid', k: ['oha'], re: /hoofdelijke? aansprakelijk|ontslag hoofdelijk/i },
    { naam: 'tweede hypotheek of verhoging', k: ['tweede'], re: /tweede hypotheek|hypotheek verhogen|verhoging van de hypotheek|onderhandse verhoging/i },
    { naam: 'offerte en dagrente', k: ['geld', 'dag', 'bprov'], re: /dagrente|bereidstellingsprovisie|geldigheid (van )?de offerte|offerte verlengen/i },
    { naam: 'risicoklassen', k: ['ltv'], re: /risicoklasse|\bltv\b|loan.to.value/i },
    { naam: 'renteverlenging', k: ['rverl', 'rvoor'], re: /renteverlenging|einde rentevaste periode|rentevoorstel/i }
  ],
  /* Geeft [{naam, href}] voor een tekst binnen een categorie. pre = pad naar de root ('' of '../'). */
  zoek: function (tekst, cat, pre) {
    if (this.CATS.indexOf(cat) < 0) return [];
    var t = String(tekst || ''), uit = [], gezien = {};
    for (var i = 0; i < this.lijst.length && uit.length < this.MAX; i++) {
      var o = this.lijst[i];
      if (!o.re.test(t)) continue;
      var sleutel = o.k.join(',');
      if (gezien[sleutel]) continue;
      gezien[sleutel] = 1;
      uit.push({ naam: o.naam, href: (pre || '') + 'voorwaarden-vergelijker.html#k=' + o.k.join(',') });
    }
    return uit;
  }
};
