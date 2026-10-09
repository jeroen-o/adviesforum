-- Adviesforum: database voor het live forum (Supabase / PostgreSQL).
-- Eenmalig uitvoeren in het Supabase-dashboard: SQL Editor -> New query -> plakken -> Run.
-- Opnieuw uitvoeren is veilig (alles is idempotent).
--
-- Principe: alles wat een adviseur plaatst, krijgt status 'wacht' en is pas zichtbaar na goedkeuring
-- door een moderator. Alleen geverifieerde adviseurs (door de beheerder gecontroleerd, AFM-register)
-- mogen plaatsen en beoordelen. De toegangsregels (row level security) staan in de database zelf,
-- zodat de publieke sleutel in de website niets kan wat niet mag.

-- ---------- Profielen ----------
create table if not exists public.profielen (
  id uuid primary key references auth.users(id) on delete cascade,
  naam text not null default '' check (char_length(naam) <= 80),
  kantoor text not null default '' check (char_length(kantoor) <= 120),
  functie text not null default '' check (char_length(functie) <= 80),
  plaats text not null default '' check (char_length(plaats) <= 80),
  afm text not null default '' check (afm = '' or afm ~ '^[0-9]{8}$'),
  linkedin text not null default '' check (linkedin = '' or linkedin ~ '^https://([a-z]+\.)?linkedin\.com/'),
  geverifieerd boolean not null default false,
  rol text not null default 'adviseur' check (rol in ('adviseur', 'moderator')),
  aangemaakt timestamptz not null default now()
);
-- Soort account: adviseur of medewerker van een aanbieder (label 'Aanbieder' bij bijdragen). Kolom apart toegevoegd zodat
-- opnieuw uitvoeren ook werkt op een database die al bestond.
alter table public.profielen add column if not exists soort text not null default 'adviseur' check (soort in ('adviseur', 'aanbieder'));

-- Hulpfuncties (security definer: lezen profielen zonder dat de toegangsregels zichzelf aanroepen)
create or replace function public.is_moderator() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profielen where id = auth.uid() and rol = 'moderator');
$$;
create or replace function public.is_geverifieerd() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profielen where id = auth.uid() and geverifieerd);
$$;

-- Nieuw account -> leeg profiel
create or replace function public.nieuw_profiel() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profielen (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists na_nieuw_account on auth.users;
create trigger na_nieuw_account after insert on auth.users for each row execute function public.nieuw_profiel();

-- Een adviseur mag zichzelf niet verifiëren of moderator maken; na een naamswijziging opnieuw verifiëren
create or replace function public.bewaak_profiel() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_moderator() then
    new.geverifieerd := old.geverifieerd;
    new.rol := old.rol;
    -- Naam, kantoor, AFM-nummer of soort account gewijzigd: opnieuw laten controleren (voorkomt dat iemand zich als een ander voordoet)
    if old.geverifieerd and (new.naam <> old.naam or new.kantoor <> old.kantoor or new.afm <> old.afm or new.soort <> old.soort) then
      new.geverifieerd := false;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists bewaak_profiel on public.profielen;
create trigger bewaak_profiel before update on public.profielen for each row execute function public.bewaak_profiel();

alter table public.profielen enable row level security;
drop policy if exists profiel_lezen on public.profielen;
create policy profiel_lezen on public.profielen for select using (geverifieerd or id = auth.uid() or public.is_moderator());
drop policy if exists profiel_eigen on public.profielen;
create policy profiel_eigen on public.profielen for update using (id = auth.uid() or public.is_moderator());

-- ---------- Vragen ----------
create table if not exists public.vragen (
  id uuid primary key default gen_random_uuid(),
  cat text not null check (cat in ('hyp','verz','pens','fisc','kred','adv','crm','comp','ov')),
  titel text not null check (char_length(titel) between 12 and 200),
  body text not null check (char_length(body) between 30 and 6000),
  tags text[] not null default '{}' check (cardinality(tags) <= 6),
  auteur uuid not null default auth.uid() references public.profielen(id) on delete cascade,
  status text not null default 'wacht' check (status in ('wacht','gepubliceerd','afgewezen')),
  reden text not null default '',
  aangemaakt timestamptz not null default now(),
  gemodereerd_op timestamptz
);
alter table public.vragen enable row level security;
drop policy if exists vraag_lezen on public.vragen;
create policy vraag_lezen on public.vragen for select using (status = 'gepubliceerd' or auteur = auth.uid() or public.is_moderator());
drop policy if exists vraag_plaatsen on public.vragen;
create policy vraag_plaatsen on public.vragen for insert with check (auteur = auth.uid() and status = 'wacht' and public.is_geverifieerd());
drop policy if exists vraag_modereren on public.vragen;
create policy vraag_modereren on public.vragen for update using (public.is_moderator());
drop policy if exists vraag_verwijderen on public.vragen;
create policy vraag_verwijderen on public.vragen for delete using (public.is_moderator() or (auteur = auth.uid() and status = 'wacht'));

-- ---------- Antwoorden ----------
-- vraag_ref: id van een vraag uit de site (bijv. 'v13') of de uuid van een live vraag
create table if not exists public.antwoorden (
  id uuid primary key default gen_random_uuid(),
  vraag_ref text not null check (vraag_ref ~ '^(v[0-9]+|[0-9a-f-]{36})$'),
  body text not null check (char_length(body) between 10 and 6000),
  auteur uuid not null default auth.uid() references public.profielen(id) on delete cascade,
  status text not null default 'wacht' check (status in ('wacht','gepubliceerd','afgewezen')),
  reden text not null default '',
  aangemaakt timestamptz not null default now(),
  gemodereerd_op timestamptz
);
create index if not exists antwoorden_vraag on public.antwoorden (vraag_ref);
alter table public.antwoorden enable row level security;
drop policy if exists antwoord_lezen on public.antwoorden;
create policy antwoord_lezen on public.antwoorden for select using (status = 'gepubliceerd' or auteur = auth.uid() or public.is_moderator());
drop policy if exists antwoord_plaatsen on public.antwoorden;
create policy antwoord_plaatsen on public.antwoorden for insert with check (auteur = auth.uid() and status = 'wacht' and public.is_geverifieerd());
drop policy if exists antwoord_modereren on public.antwoorden;
create policy antwoord_modereren on public.antwoorden for update using (public.is_moderator());
drop policy if exists antwoord_verwijderen on public.antwoorden;
create policy antwoord_verwijderen on public.antwoorden for delete using (public.is_moderator() or (auteur = auth.uid() and status = 'wacht'));

-- ---------- Beoordelingen (1 tot 5, één per adviseur per antwoord, niet op je eigen antwoord) ----------
create table if not exists public.beoordelingen (
  antwoord_id uuid not null references public.antwoorden(id) on delete cascade,
  auteur uuid not null default auth.uid() references public.profielen(id) on delete cascade,
  score smallint not null check (score between 1 and 5),
  aangemaakt timestamptz not null default now(),
  primary key (antwoord_id, auteur)
);
alter table public.beoordelingen enable row level security;
drop policy if exists beoordeling_lezen on public.beoordelingen;
create policy beoordeling_lezen on public.beoordelingen for select using (true);
drop policy if exists beoordeling_geven on public.beoordelingen;
create policy beoordeling_geven on public.beoordelingen for insert with check (
  auteur = auth.uid() and public.is_geverifieerd()
  and not exists (select 1 from public.profielen p where p.id = auth.uid() and p.soort = 'aanbieder') -- aanbieders beoordelen niet
  and not exists (select 1 from public.antwoorden a where a.id = antwoord_id and a.auteur = auth.uid()));
drop policy if exists beoordeling_wijzigen on public.beoordelingen;
create policy beoordeling_wijzigen on public.beoordelingen for update using (auteur = auth.uid());
drop policy if exists beoordeling_intrekken on public.beoordelingen;
create policy beoordeling_intrekken on public.beoordelingen for delete using (auteur = auth.uid());

-- ---------- Meldingen (melden en verwijderen) ----------
create table if not exists public.meldingen (
  id uuid primary key default gen_random_uuid(),
  soort text not null check (soort in ('vraag','antwoord')),
  ref text not null check (char_length(ref) <= 40),
  reden text not null check (char_length(reden) between 5 and 1000),
  melder uuid default auth.uid() references public.profielen(id) on delete set null,
  afgehandeld boolean not null default false,
  aangemaakt timestamptz not null default now()
);
alter table public.meldingen enable row level security;
drop policy if exists melding_doen on public.meldingen;
create policy melding_doen on public.meldingen for insert with check (auth.uid() is not null and afgehandeld = false);
drop policy if exists melding_lezen on public.meldingen;
create policy melding_lezen on public.meldingen for select using (public.is_moderator());
drop policy if exists melding_afhandelen on public.meldingen;
create policy melding_afhandelen on public.meldingen for update using (public.is_moderator());

-- Rechten voor de publieke (anon) en ingelogde (authenticated) rol
grant usage on schema public to anon, authenticated;
grant select on public.profielen, public.vragen, public.antwoorden, public.beoordelingen to anon, authenticated;
grant update on public.profielen to authenticated;
grant insert, update, delete on public.vragen, public.antwoorden, public.beoordelingen to authenticated;
grant insert, select, update on public.meldingen to authenticated;

-- Na het aanmaken van je eigen account (eerste keer inloggen op de site), maak jezelf moderator:
--   update public.profielen set rol = 'moderator', geverifieerd = true
--   where id = (select id from auth.users where email = 'JOUW-ADRES');
