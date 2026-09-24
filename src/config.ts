// Réglages généraux du site. Les bénévoles peuvent modifier les liens ici.

export const SITE = {
  nom: 'Amicale du PSIG de Montargis',
  nomCourt: 'Amicale PSIG Montargis',
  description:
    "Écussons, textile et accessoires de l'Amicale du PSIG de Montargis. Drops en tirage limité, vente sur HelloAsso.",
  instagram: 'https://www.instagram.com/amicale_psig_montargis/',
  instagramPseudo: '@amicale_psig_montargis',
  // Boutique HelloAsso : lien par défaut si un produit n'a pas encore son lien propre.
  boutiqueHelloAsso:
    'https://www.helloasso.com/associations/amicale-psig-montargis/boutiques/ecussons-psig-montargis',
  // Page de la liste privée (formulaire branché en phase 2).
  listePrivee: '/liste-privee',
} as const;

export const CATEGORIES = {
  pack: 'Packs',
  patch: 'Écussons',
  textile: 'Textile',
  accessoire: 'Accessoires',
  sticker: 'Stickers',
  calendrier: 'Calendriers',
} as const;

export type Categorie = keyof typeof CATEGORIES;

export const STATUTS_PRODUIT = {
  precommande: 'Précommande',
  disponible: 'Disponible',
  epuise: 'Épuisé',
  archive: 'Archivé',
} as const;

export type StatutProduit = keyof typeof STATUTS_PRODUIT;
