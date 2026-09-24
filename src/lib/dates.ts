// Toutes les dates du site sont des heures de Paris.
// Un bénévole écrit "2026-10-05 18:00" : on l'interprète à 18 h, heure de Paris,
// quel que soit le fuseau du serveur qui construit le site.

const FUSEAU = 'Europe/Paris';

const lecteur = new Intl.DateTimeFormat('en-US', {
  timeZone: FUSEAU,
  hourCycle: 'h23',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

/** Décalage (en ms) entre l'heure de Paris et UTC à un instant donné. */
function decalageParis(instant: number): number {
  const p = Object.fromEntries(
    lecteur.formatToParts(new Date(instant)).map((x) => [x.type, x.value]),
  );
  const murale = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return murale - Math.floor(instant / 1000) * 1000;
}

/** Convertit une heure « murale » de Paris en instant réel. */
function depuisHeureParis(a: number, mo: number, j: number, h = 0, mi = 0): Date {
  const approx = Date.UTC(a, mo - 1, j, h, mi);
  const t = approx - decalageParis(approx);
  return new Date(approx - decalageParis(t));
}

const FORMAT_SIMPLE = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2}):(\d{2}))?$/;

/**
 * Lit une date écrite dans un fichier de contenu.
 * - "2026-10-05" ou "2026-10-05 18:00" : heure de Paris.
 * - Une date avec fuseau explicite (ex. "2026-10-05T18:00:00+02:00") est respectée.
 * - Une date non guillemetée (convertie par YAML en UTC) est relue comme heure de Paris.
 */
export function lireDateParis(valeur: unknown): Date | unknown {
  if (valeur instanceof Date) {
    return depuisHeureParis(
      valeur.getUTCFullYear(),
      valeur.getUTCMonth() + 1,
      valeur.getUTCDate(),
      valeur.getUTCHours(),
      valeur.getUTCMinutes(),
    );
  }
  if (typeof valeur === 'string') {
    const m = valeur.trim().match(FORMAT_SIMPLE);
    if (m) return depuisHeureParis(+m[1], +m[2], +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
    return new Date(valeur);
  }
  return valeur;
}

const formatJour = new Intl.DateTimeFormat('fr-FR', {
  timeZone: FUSEAU,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});
const formatJourAnnee = new Intl.DateTimeFormat('fr-FR', {
  timeZone: FUSEAU,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
const formatHeure = new Intl.DateTimeFormat('fr-FR', {
  timeZone: FUSEAU,
  hour: '2-digit',
  minute: '2-digit',
});
const formatMois = new Intl.DateTimeFormat('fr-FR', {
  timeZone: FUSEAU,
  month: 'long',
  year: 'numeric',
});

/** « lundi 5 octobre, 18 h 00 » */
export function dateEtHeure(d: Date): string {
  return `${formatJour.format(d)}, ${formatHeure.format(d).replace(':', ' h ')}`;
}

/** « 5 octobre 2026 » */
export function dateLongue(d: Date): string {
  return formatJourAnnee.format(d);
}

/** « novembre 2026 » */
export function moisAnnee(d: Date): string {
  return formatMois.format(d);
}

const formatPrix = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

/** « 12,00 € » ou « 12 € » pour un prix rond. */
export function prix(montant: number): string {
  return Number.isInteger(montant)
    ? `${montant} €`
    : formatPrix.format(montant);
}
