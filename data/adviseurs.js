/* ADVISEURS die antwoorden geven. De beheerder voegt ze handmatig toe.
 * Velden: id (uniek, bijv. 'u9'), naam, functie, kantoor, rol ('adviseur', 'beheer' of 'compliance'),
 * geverifieerd (true = aangemeld met geldig LinkedIn-profiel en goedgekeurd door de beheerder; toont '✓ Geverifieerd'),
 * demo (true = fictief voorbeeldprofiel; toont 'Voorbeeldprofiel' in plaats van '✓ Geverifieerd'. Haal demo weg of verwijder het profiel zodra echte adviseurs zijn toegevoegd),
 * codeHash (SHA-256 van de persoonlijke inlogcode; maak die met beheer-code.html en geef de code zelf alleen aan de adviseur).
 * Alleen naam, functie en kantoor zijn zichtbaar op het forum. Zet hier geen e-mailadressen of telefoonnummers.
 */
window.ADVISEURS=[
 {id:'u1',demo:true,naam:'Sanne de Vries',functie:'Hypotheekadviseur',kantoor:'Utrecht',rol:'adviseur',geverifieerd:true,codeHash:'e23fea172a823b8e054cc74073b30a99a3c899607aead8f9a46fa1488e40c4e4'},
 {id:'u2',demo:true,naam:'Mark Jansen',functie:'Financieel planner',kantoor:'Amsterdam',rol:'adviseur',geverifieerd:true,codeHash:'e44d28fc3bb07a736e4f823327368396b08bc25fff4c94f53779cff7315fc2f9'},
 {id:'u3',demo:true,naam:'Fatima El Amrani',functie:'Verzekeringsadviseur',kantoor:'Rotterdam',rol:'adviseur',geverifieerd:true,codeHash:'8882baa4a74d1ca917d212c224e4a4373241ec4194c3f3247d4412a80aef7107'},
 {id:'u4',demo:true,naam:'Tom Bakker',functie:'Hypotheekadviseur',kantoor:'Eindhoven',rol:'adviseur',geverifieerd:true,codeHash:'2bebc41e0d8f1257839bb6ae055dba0a69a307fc5cb56f2f927ac38d7be840df'},
 {id:'u5',demo:true,naam:'Lisa van Dijk',functie:'Erkend Hypothecair Planner',kantoor:'Zwolle',rol:'adviseur',geverifieerd:true,codeHash:'f1bf2cb50681908afa4d8f45c18ec36fb40ea0de2bf761fdaed8615a3a6d3c70'},
 {id:'u6',demo:true,naam:'Ruben Visser',functie:'Applicatiebeheerder Adviespakket & CRM',kantoor:'Blinqx, Amsterdam',rol:'beheer',geverifieerd:true,codeHash:'2cfb311b131720e10882078758375a0e832968410df0443b1b95ebff2bf57fbe'},
 {id:'u7',demo:true,naam:'Nadia Peters',functie:'Pensioenadviseur',kantoor:'Groningen',rol:'adviseur',geverifieerd:true,codeHash:'33bcea749323aa432ec4bbb45ced824d3bb230cfa2ab65f6d77dbf84b54be614'},
 {id:'u8',demo:true,naam:'Joris Hendriks',functie:'Compliance officer',kantoor:'Blinqx, Amsterdam',rol:'compliance',geverifieerd:true,codeHash:'fdb42a51f577b1b25b71b3ed51ab701c461282d6829750fe9ddcd5c54a0d4de9'}
];
