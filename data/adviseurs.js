/* ADVISEURS die antwoorden geven. De beheerder voegt ze handmatig toe.
 * Velden: id (uniek, bijv. 'u9'), naam, functie, kantoor, rol ('adviseur', 'beheer' of 'compliance'),
 * geverifieerd (true = aangemeld met geldig LinkedIn-profiel en goedgekeurd door de beheerder; toont '✓ Geverifieerd'),
 * demo (true = fictief voorbeeldprofiel; toont 'Voorbeeldprofiel' in plaats van '✓ Geverifieerd'. Haal demo weg of verwijder het profiel zodra echte adviseurs zijn toegevoegd),
 * codeHash (SHA-256 van de persoonlijke inlogcode; maak die met beheer-code.html en geef de code zelf alleen aan de adviseur). Voorbeeldprofielen hebben geen codeHash en kunnen dus niet inloggen.
 * Alleen naam, functie en kantoor zijn zichtbaar op het forum. Zet hier geen e-mailadressen of telefoonnummers.
 */
window.ADVISEURS=[
 {id:'u1',demo:true,naam:'Sanne de Vries',functie:'Hypotheekadviseur',kantoor:'Utrecht',rol:'adviseur',geverifieerd:true},
 {id:'u2',demo:true,naam:'Mark Jansen',functie:'Financieel planner',kantoor:'Amsterdam',rol:'adviseur',geverifieerd:true},
 {id:'u3',demo:true,naam:'Fatima El Amrani',functie:'Verzekeringsadviseur',kantoor:'Rotterdam',rol:'adviseur',geverifieerd:true},
 {id:'u4',demo:true,naam:'Tom Bakker',functie:'Hypotheekadviseur',kantoor:'Eindhoven',rol:'adviseur',geverifieerd:true},
 {id:'u5',demo:true,naam:'Lisa van Dijk',functie:'Erkend Hypothecair Planner',kantoor:'Zwolle',rol:'adviseur',geverifieerd:true},
 {id:'u6',demo:true,naam:'Ruben Visser',functie:'Applicatiebeheerder Adviespakket & CRM',kantoor:'Blinqx, Amsterdam',rol:'beheer',geverifieerd:true},
 {id:'u7',demo:true,naam:'Nadia Peters',functie:'Pensioenadviseur',kantoor:'Groningen',rol:'adviseur',geverifieerd:true},
 {id:'u8',demo:true,naam:'Joris Hendriks',functie:'Compliance officer',kantoor:'Blinqx, Amsterdam',rol:'compliance',geverifieerd:true}
];
