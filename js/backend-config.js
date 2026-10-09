/* Koppeling met de database van het live forum (Supabase).
 * Leeg = uit: de site werkt dan zoals voorheen (antwoorden blijven in de eigen sessie, vragen gaan per e-mail).
 * Aanzetten: vul de Project URL en de publieke anon key in (Supabase -> Project Settings -> API). Zie docs/backend.md.
 * De anon key is bedoeld om publiek te zijn; wat ermee mag, bepalen de toegangsregels in supabase/schema.sql.
 * Zet hier NOOIT de service_role key.
 */
window.ADVIESFORUM_BACKEND = window.ADVIESFORUM_BACKEND || {
  url: '',
  anonKey: ''
};
