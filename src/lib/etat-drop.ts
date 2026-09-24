// Calcul de l'état d'un drop à partir de ses dates.
// Ce fichier sert à la fois pendant la construction du site et dans le navigateur,
// pour que l'état change tout seul à l'heure dite, sans republier le site.

export type EtatDrop = 'avenir' | 'teasing' | 'acces' | 'ouvert' | 'clos' | 'archive';

export interface DatesDrop {
  teasing: number;
  acces: number;
  ouverture: number;
  cloture: number;
  livraison: number;
}

export const LIBELLES_ETAT: Record<EtatDrop, string> = {
  avenir: 'À venir',
  teasing: 'Bientôt',
  acces: 'Accès anticipé',
  ouvert: 'Ouvert',
  clos: 'Drop terminé',
  archive: 'Archivé',
};

/**
 * - avant la date de teasing : à venir (le drop n'est pas montré)
 * - teasing → accès anticipé → ouvert → clos
 * - archivé une fois la date de livraison prévue passée
 */
export function calculerEtat(d: DatesDrop, maintenant: number = Date.now()): EtatDrop {
  if (maintenant < d.teasing) return 'avenir';
  if (maintenant < d.acces) return 'teasing';
  if (maintenant < d.ouverture) return 'acces';
  if (maintenant < d.cloture) return 'ouvert';
  if (maintenant < d.livraison) return 'clos';
  return 'archive';
}

/** Instant visé par le compte à rebours selon l'état, ou null s'il n'y en a pas. */
export function echeance(etat: EtatDrop, d: DatesDrop): { cible: number; libelle: string } | null {
  switch (etat) {
    case 'avenir':
    case 'teasing':
      return { cible: d.acces, libelle: 'Accès anticipé dans' };
    case 'acces':
      return { cible: d.ouverture, libelle: 'Ouverture à tous dans' };
    case 'ouvert':
      return { cible: d.cloture, libelle: 'Clôture dans' };
    default:
      return null;
  }
}

/** Prochain instant où l'état changera (pour recalculer pile à l'heure). */
export function prochainChangement(d: DatesDrop, maintenant: number = Date.now()): number | null {
  const suivants = [d.teasing, d.acces, d.ouverture, d.cloture, d.livraison].filter(
    (t) => t > maintenant,
  );
  return suivants.length ? Math.min(...suivants) : null;
}

export function decomposer(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    jours: Math.floor(s / 86400),
    heures: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    secondes: s % 60,
  };
}

/**
 * Attributs à poser sur un élément qui ne doit s'afficher que dans certains états.
 * Exemple : <p {...si(['ouvert'], etat)}>…</p>
 * Le navigateur remet à jour l'affichage quand l'état change (voir scripts/drops.ts).
 */
export function si(etats: EtatDrop[], etatActuel: EtatDrop) {
  return { 'data-si': etats.join(' '), hidden: !etats.includes(etatActuel) };
}

/** Attributs de la zone qui suit l'état d'un drop. */
export function zoneDrop(dates: DatesDrop, etat: EtatDrop) {
  return { 'data-drop': '', 'data-dates': JSON.stringify(dates), 'data-etat': etat };
}
