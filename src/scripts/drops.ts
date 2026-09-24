// Met à jour, dans le navigateur, l'état des drops et les comptes à rebours.
// Ainsi un drop passe de « teasing » à « ouvert » à l'heure dite, sans republier le site.

import { calculerEtat, decomposer, echeance, type DatesDrop } from '../lib/etat-drop';
import { dateEtHeure } from '../lib/dates';

const deux = (n: number) => String(n).padStart(2, '0');

function mettreAJour(zone: HTMLElement, maintenant: number) {
  let dates: DatesDrop;
  try {
    dates = JSON.parse(zone.dataset.dates ?? '');
  } catch {
    return;
  }
  const etat = calculerEtat(dates, maintenant);

  if (zone.dataset.etat !== etat) {
    zone.dataset.etat = etat;
    zone.querySelectorAll<HTMLElement>('[data-si]').forEach((el) => {
      if (el.closest('[data-drop]') !== zone) return;
      el.hidden = !(el.dataset.si ?? '').split(' ').includes(etat);
    });
  }

  const ech = echeance(etat, dates);
  zone.querySelectorAll<HTMLElement>('[data-rebours]').forEach((el) => {
    if (el.closest('[data-drop]') !== zone) return;
    el.hidden = !ech;
    if (!ech) return;
    const r = decomposer(ech.cible - maintenant);
    const valeurs: Record<string, string> = {
      jours: String(r.jours),
      heures: deux(r.heures),
      minutes: deux(r.minutes),
      secondes: deux(r.secondes),
    };
    el.querySelectorAll<HTMLElement>('[data-unite]').forEach((u) => {
      const v = valeurs[u.dataset.unite ?? ''];
      if (v !== undefined && u.textContent !== v) u.textContent = v;
    });
    const libelle = el.querySelector<HTMLElement>('[data-rebours-libelle]');
    if (libelle && libelle.textContent !== ech.libelle) libelle.textContent = ech.libelle;
    const cible = el.querySelector<HTMLElement>('[data-rebours-cible]');
    const texteCible = `Le ${dateEtHeure(new Date(ech.cible))}`;
    if (cible && cible.textContent !== texteCible) cible.textContent = texteCible;
  });
}

function tout() {
  const maintenant = Date.now();
  document.querySelectorAll<HTMLElement>('[data-drop]').forEach((z) => mettreAJour(z, maintenant));
}

if (document.querySelector('[data-drop]')) {
  tout();
  setInterval(tout, 1000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tout();
  });
}
