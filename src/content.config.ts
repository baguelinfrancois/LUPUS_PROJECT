import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { lireDateParis } from './lib/dates';

// Date écrite "2026-10-05 18:00" = 18 h heure de Paris.
const dateParis = z.preprocess(lireDateParis, z.date());

// Un fichier .md par drop dans src/content/drops/.
// Le texte sous l'en-tête (---) est l'histoire du drop.
const drops = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/drops' }),
  schema: ({ image }) =>
    z.object({
      nom_de_code: z.string(),
      accroche: z.string(),
      visuel_principal: image(),
      texte_alternatif: z.string(),
      lookbook: z
        .array(z.object({ photo: image(), legende: z.string() }))
        .default([]),
      date_teasing: dateParis,
      date_acces_anticipe: dateParis,
      date_ouverture: dateParis,
      date_cloture: dateParis,
      date_livraison_prevue: dateParis,
      faq: z
        .array(z.object({ question: z.string(), reponse: z.string() }))
        .default([]),
    }),
});

// Un fichier .md par produit dans src/content/produits/.
// Le texte sous l'en-tête (---) est la description longue (facultative).
const produits = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/produits' }),
  schema: ({ image }) =>
    z.object({
      nom: z.string(),
      description_courte: z.string(),
      prix: z.number().nonnegative(),
      lien_helloasso: z.url().optional(),
      photos: z
        .array(z.object({ photo: image(), texte_alternatif: z.string() }))
        .min(1),
      drop: z.string().optional(),
      statut: z.enum(['precommande', 'disponible', 'epuise', 'archive']),
      numerotation: z.string().optional(),
      ordre: z.number().default(100),
      categorie: z.enum(['pack', 'patch', 'textile', 'accessoire', 'sticker', 'calendrier']),
      premium: z.boolean().default(false),
      // Produit montré dans le viseur de l'accueil quand aucun drop n'est en cours.
      a_la_une: z.boolean().default(false),
    }),
});

export const collections = { drops, produits };
