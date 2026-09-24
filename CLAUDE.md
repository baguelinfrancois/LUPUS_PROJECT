# Site vitrine — Amicale du PSIG de Montargis

## Objectif
Un site vitrine qui donne envie d'acheter, avec l'univers de l'amicale : PSIG de nuit, interventions, unité soudée, Montargis.
Le site ne gère AUCUN paiement : chaque bouton d'achat renvoie vers le produit sur la boutique HelloAsso
(https://www.helloasso.com/associations/amicale-psig-montargis/boutiques/ecussons-psig-montargis).
Le lien en bio Instagram (@amicale_psig_montargis) pointera vers ce site.

Priorités, dans l'ordre : 1) convertir un visiteur venu d'Instagram en acheteur, 2) créer l'attente autour des drops,
3) collecter des inscrits pour la liste privée, 4) raconter l'amicale et à quoi sert l'argent.

## Public et contexte d'usage
- 90 % des visiteurs arrivent depuis Instagram, sur téléphone, dans le navigateur intégré d'Instagram.
  Tout doit être pensé et testé d'abord sur mobile, dans ce navigateur.
- Publics : collectionneurs de patchs, gendarmes et forces de l'ordre, proches qui cherchent un cadeau, civils fans de tacticool/EDC.
- Le site est mis à jour par des bénévoles non développeurs : ajouter un produit ou un drop doit être simple et documenté.

## Stack
- Astro (site statique), TypeScript, CSS maison (pas de framework UI lourd)
- Produits et drops stockés en fichiers Markdown/JSON (Astro content collections)
- Hébergement gratuit (Vercel ou Netlify), déploiement automatique à chaque push
- Formulaire liste privée : service d'e-mailing avec offre gratuite (ex. Brevo), à valider avec l'utilisateur
- Statistiques sans cookies (pour éviter un bandeau cookies), à valider avec l'utilisateur

## Règles de travail pour Claude
- Avancer phase par phase, tester chaque phase sur mobile avant la suivante.
- Petits commits en français.
- Demander avant d'ajouter une dépendance ou un service tiers.
- Aucun secret dans le code (variables d'environnement).
- Expliquer chaque étape de configuration simplement : l'utilisateur n'est pas développeur.
- Rédiger un README.md "Comment ajouter un produit / un drop" pour les bénévoles, avec captures ou exemples.

## Direction visuelle
L'identité existe déjà sur Instagram : photos sombres, vision nocturne verte, bleu nuit, gris, loup (mascotte Fenrir), camouflage.
Le site la prolonge, il ne l'invente pas.

- Couleurs (à ajuster sur les visuels réels) :
  - Nuit profonde #0D1321 (fond)
  - Bleu furtif #1C2A44 (surfaces, en écho à l'écusson "Le Furtif")
  - Gris stealth #8A9099 (texte secondaire, en écho à "Stealth")
  - Blanc lampe #E8E6E1 (texte principal)
  - Vert vision nocturne #9BE37A — UNIQUEMENT pour l'effet vision nocturne et le compte à rebours, jamais en décoration
- Typographie : une police titre condensée à l'esprit pochoir/marquage militaire (ex. Big Shoulders Stencil Display),
  une police texte condensée très lisible (ex. Barlow ou Barlow Condensed). Proposer 2 options avant de figer.
- Élément signature (la seule audace du site) : le hero de la page d'accueil est un viseur de vision nocturne circulaire,
  en écho à la photo la plus forte du compte Instagram, qui révèle le produit phare du drop en cours.
  Tout le reste reste sobre et discipliné.
- Photos : produits portés et photographiés de nuit, pas de photos de catalogue sur fond blanc.
- Ton des textes : sobre, direct, tactique, phrases courtes. Pas de superlatifs commerciaux. Emojis limités.
- Éviter : animations d'apparition sur chaque section, cartes arrondies identiques partout, labels tout en majuscules partout.
- Qualité minimale : responsive, contrastes accessibles, focus clavier visible, respect de "réduire les animations".

## OPSEC (obligatoire)
- Aucune photo avec un visage non flouté (sauf accord écrit), plaque lisible, lieu ou local identifiable, écran ou document lisible.
- Métadonnées EXIF et géolocalisation supprimées de toutes les images (vérifier que le pipeline d'images les retire bien).
- Aucune information sur les procédures, effectifs, horaires ou configurations d'équipement dans les textes.

## Modèle de contenu
**Produit** : nom, description courte, prix, lien_helloasso, photos, drop (optionnel), statut
(précommande | disponible | épuisé | archivé), numérotation (ex. "tirage limité à 100"), ordre d'affichage, catégorie
(patch | textile | accessoire | sticker | calendrier | pack)

**Drop** : nom de code, accroche, histoire (texte), visuel principal, lookbook (photos),
date_teasing, date_acces_anticipe, date_ouverture, date_cloture, date_livraison_prevue, statut calculé automatiquement

États d'un drop, calculés à partir des dates :
- Teasing : visuel flouté ou en silhouette, compte à rebours, bouton "Rejoindre la liste privée"
- Accès anticipé : message "Réservé à la liste privée", produits visibles
- Ouvert : produits achetables, compte à rebours jusqu'à la clôture, date de livraison affichée
- Clos : "Drop terminé", produits marqués épuisés, invitation à rejoindre la liste pour le prochain
- Archivé : visible dans une page "Anciens drops" (les collectionneurs adorent ça)

## Pages
- **Accueil** : hero viseur nocturne avec le drop en cours et son compte à rebours, bouton d'achat ou d'inscription selon l'état,
  sélection de produits permanents, bloc "À quoi sert votre achat", lien vers la liste privée
- **Page drop** (/drops/[nom]) : histoire du drop, lookbook, produits avec prix, tirage et bouton "Acheter sur HelloAsso",
  dates clés, FAQ du drop
- **Boutique** : produits permanents filtrables par catégorie (patchs, textile, accessoires…)
- **Anciens drops** : archive des drops passés
- **La Meute** : adhésion de soutien annuelle (lien vers le module adhésion HelloAsso), avantages listés
- **L'amicale** : qui vous êtes, à quoi sert l'argent (cohésion, actions, soutien), sans aucune info opérationnelle
- **Liste privée** : formulaire e-mail avec case de consentement explicite (RGPD)
- **FAQ** : livraison, délais de précommande, tailles, suivi de commande, contact
- **Mentions légales et confidentialité** : nom de l'association, siège, responsable de publication, hébergeur,
  traitement des e-mails de la liste privée

## Conversion
- Bouton d'achat visible sans défiler sur chaque fiche produit, sur mobile.
- Libellé des boutons : "Acheter sur HelloAsso" (l'acheteur doit savoir qu'il change de site).
- Sur chaque page produit, rappeler : tirage limité, date de clôture, date de livraison prévue.
- Mettre en avant les packs et le produit premium en premier (ancrage de prix).
- Suivre les clics sur les boutons d'achat et d'inscription dans les statistiques.

## Phases

### Phase 1 — Socle
Projet Astro, direction visuelle (2 options de typo à valider), accueil avec hero viseur nocturne,
page drop avec états automatiques, boutique, déploiement en ligne sur une adresse gratuite.

### Phase 2 — Liste privée et Meute
Formulaire liste privée relié au service d'e-mailing, page La Meute, page L'amicale, FAQ, mentions légales.

### Phase 3 — Finitions
Nom de domaine, statistiques, page Anciens drops, optimisation des images, tests dans le navigateur Instagram,
README bénévoles complet.

### Phase 4 (optionnelle) — Édition sans code
Interface d'administration simple (ex. Decap CMS) pour que les bénévoles ajoutent produits et drops sans toucher aux fichiers.
