import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../config';
import { calculerEtat, type DatesDrop, type EtatDrop } from './etat-drop';

export type Drop = CollectionEntry<'drops'>;
export type Produit = CollectionEntry<'produits'>;

export function datesDuDrop(drop: Drop): DatesDrop {
  const d = drop.data;
  return {
    teasing: d.date_teasing.getTime(),
    acces: d.date_acces_anticipe.getTime(),
    ouverture: d.date_ouverture.getTime(),
    cloture: d.date_cloture.getTime(),
    livraison: d.date_livraison_prevue.getTime(),
  };
}

export function etatDuDrop(drop: Drop, maintenant = Date.now()): EtatDrop {
  return calculerEtat(datesDuDrop(drop), maintenant);
}

export function lienAchat(produit: Produit): string {
  return produit.data.lien_helloasso ?? SITE.boutiqueHelloAsso;
}

/** Packs et produits premium d'abord (ancrage de prix), puis l'ordre choisi. */
function trierProduits(a: Produit, b: Produit): number {
  const poids = (p: Produit) => (p.data.categorie === 'pack' ? 0 : p.data.premium ? 1 : 2);
  return poids(a) - poids(b) || a.data.ordre - b.data.ordre || a.data.nom.localeCompare(b.data.nom);
}

export async function tousLesProduits(): Promise<Produit[]> {
  return (await getCollection('produits')).sort(trierProduits);
}

/** Produits hors drop, non archivés. */
export async function produitsPermanents(): Promise<Produit[]> {
  return (await tousLesProduits()).filter((p) => !p.data.drop && p.data.statut !== 'archive');
}

export async function produitsDuDrop(id: string): Promise<Produit[]> {
  return (await tousLesProduits()).filter((p) => p.data.drop === id);
}

export async function tousLesDrops(): Promise<Drop[]> {
  return (await getCollection('drops')).sort(
    (a, b) => b.data.date_ouverture.getTime() - a.data.date_ouverture.getTime(),
  );
}

/**
 * Le drop mis en avant sur l'accueil :
 * 1. un drop en teasing, accès anticipé ou ouvert (le plus proche de l'ouverture) ;
 * 2. sinon le prochain drop à venir ;
 * 3. sinon le dernier drop clos.
 */
export async function dropALaUne(maintenant = Date.now()): Promise<Drop | undefined> {
  const drops = await tousLesDrops();
  const avecEtat = drops.map((d) => ({ d, e: etatDuDrop(d, maintenant) }));
  const parOuverture = (x: { d: Drop }, y: { d: Drop }) =>
    x.d.data.date_ouverture.getTime() - y.d.data.date_ouverture.getTime();
  const actifs = avecEtat.filter((x) => ['teasing', 'acces', 'ouvert'].includes(x.e)).sort(parOuverture);
  if (actifs.length) return actifs[0].d;
  const aVenir = avecEtat.filter((x) => x.e === 'avenir').sort(parOuverture);
  if (aVenir.length) return aVenir[0].d;
  return avecEtat.find((x) => x.e === 'clos')?.d;
}

/** Produit montré dans le viseur quand aucun drop n'est en cours : celui marqué « a_la_une », sinon le premier. */
export async function produitALaUne(): Promise<Produit | undefined> {
  const produits = await produitsPermanents();
  return produits.find((p) => p.data.a_la_une) ?? produits[0];
}
