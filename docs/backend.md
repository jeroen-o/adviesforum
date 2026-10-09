# Live forum aanzetten (Supabase)

Het forum werkt nu zonder database: vragen gaan per e-mail naar de beheerder en antwoorden blijven in de eigen sessie. Met een Supabase-project wordt het een live forum: inloggen met een e-maillink, vragen en antwoorden die na moderatie voor iedereen zichtbaar zijn, beoordelingen en meldingen. De website blijft op GitHub Pages; alleen de gegevens staan bij Supabase.

Alles staat al klaar in de code. Zolang `js/backend-config.js` leeg is, verandert er niets op de site.

## 1. Project aanmaken (± 10 minuten)

1. Maak een account op supabase.com en kies **New project**.
2. Naam: `adviesforum`. **Region: een EU-regio** (bijvoorbeeld Frankfurt). Bewaar het databasewachtwoord in je wachtwoordkluis.
3. Vraag de verwerkersovereenkomst (DPA) van Supabase aan en bewaar die bij je AVG-administratie.

## 2. Database inrichten

1. Ga naar **SQL Editor → New query**.
2. Plak de inhoud van `supabase/schema.sql` en klik **Run**. Opnieuw uitvoeren is veilig.

Daarmee staan de tabellen (profielen, vragen, antwoorden, beoordelingen, meldingen) en de toegangsregels klaar. Alles wat een adviseur plaatst, krijgt status `wacht` en is pas zichtbaar na goedkeuring.

## 3. Inloggen instellen

1. **Authentication → Providers → Email**: aan. Wachtwoorden zijn niet nodig; de site gebruikt alleen de e-maillink (magic link).
2. **Authentication → URL Configuration**:
   - Site URL: `https://adviesforum.nl`
   - Redirect URLs: `https://adviesforum.nl/index.html` en `https://adviesforum.nl/moderatie.html`
3. **Authentication → Emails / SMTP**: stel een eigen afzender in op je eigen domein (bijvoorbeeld `forum@adviesforum.nl`). De standaardafzender van Supabase is alleen voor testen en heeft een lage limiet.
4. **Email Templates → Magic Link**: zet de tekst in het Nederlands, bijvoorbeeld:

   > Onderwerp: Je inloglink voor het Adviesforum
   >
   > Hallo,
   >
   > Klik op de link hieronder om in te loggen op het Adviesforum. De link werkt één keer en is kort geldig.
   >
   > <a href="{{ .ConfirmationURL }}">Inloggen op het Adviesforum</a>
   >
   > Heb je dit niet aangevraagd? Dan kun je deze mail negeren.

## 4. Sleutels in de site zetten

1. **Project Settings → API**: kopieer de **Project URL** en de **anon public** key.
2. Vul ze in `js/backend-config.js` in:
   ```js
   window.ADVIESFORUM_BACKEND = window.ADVIESFORUM_BACKEND || {
     url: 'https://xxxxxxxx.supabase.co',
     anonKey: 'eyJ...'
   };
   ```
3. Commit en push (of laat het mij doen). De anon key mag publiek zijn: wat ermee kan, bepalen de toegangsregels. **Zet nooit de service_role key in de site.**

## 5. Jezelf moderator maken

1. Log op de site in met je eigen e-mailadres (knop *Inloggen adviseur*) en vul je profiel in.
2. Voer in de SQL Editor uit (met je eigen adres):
   ```sql
   update public.profielen set rol = 'moderator', geverifieerd = true
   where id = (select id from auth.users where email = 'jouw@adres.nl');
   ```
3. Open `https://adviesforum.nl/moderatie.html`, log in en je ziet de wachtrij.

## Dagelijks gebruik

- **Moderatie** (`moderatie.html`): accounts verifiëren (AFM-register en website of LinkedIn), vragen en antwoorden publiceren of afwijzen, meldingen afhandelen. Streef naar een reactie binnen twee werkdagen (dat staat in de gebruiksvoorwaarden).
- **Medemoderator**: zet `rol = 'moderator'` bij een tweede persoon (zelfde SQL als hierboven).
- **Account of bijdrage verwijderen op verzoek**: in Supabase via **Table Editor** (bijdrage) of **Authentication → Users → Delete user** (account en alle bijdragen).
- **Back-ups**: zie **Database → Backups** in Supabase; controleer welke bewaartermijn je abonnement heeft.

## Wat de site doet als het live forum aanstaat

- De knop *Inloggen adviseur* vraagt een e-mailadres en stuurt een inloglink. Na de eerste keer vult de adviseur zijn profiel in; plaatsen en beoordelen kan pas na verificatie door de beheerder.
- Nieuwe vragen en antwoorden gaan naar de wachtrij; na goedkeuring staan ze op het forum, naast de bestaande vragen.
- Beoordelingen van antwoorden (1 tot 5 sterren) worden opgeslagen. Elke live bijdrage heeft een knop *Melden*.
- Bezoekers zonder account kunnen nog steeds per e-mail een vraag stellen.
- De sessie staat in de functionele cookie `af_sessie` (staat in de privacyverklaring).

## Beperkingen en vervolgstappen

- Live vragen staan nog niet in de statische pagina's (`vraag/`) en de sitemap. Dat kan later met een stap in de workflow die gepubliceerde vragen ophaalt.
- De beoordeling van de adviseur (tweede sterrenrij) blijft voorlopig in de eigen sessie; alleen de beoordeling van het antwoord wordt opgeslagen.
- Supabase stuurt de inlogmails; met een eigen SMTP-afzender komen ze betrouwbaarder aan.

## Compliance en AVG (checklist)

- [ ] Verwerkersovereenkomst Supabase getekend en bewaard
- [ ] Verwerkingsregister bijgewerkt (forumaccounts en bijdragen)
- [ ] Gebruiksvoorwaarden (`gebruiksvoorwaarden.html`) besproken met compliance
- [ ] Privacyverklaring gecontroleerd (`privacy.html#forum`)
- [ ] Afspraak wie modereert en binnen welke termijn
