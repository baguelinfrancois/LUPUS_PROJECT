# Site de l'Amicale du PSIG de Montargis

Site vitrine des écussons et produits de l'amicale. **Aucun paiement sur le site** : chaque bouton « Acheter sur HelloAsso » renvoie vers la boutique HelloAsso.

> ⚠️ Les produits, drops, prix et photos actuels sont des **exemples** (visuels marqués « PROVISOIRE »). Il faut tous les remplacer avant la mise en ligne publique.

---

## Ajouter un produit

1. Ouvrez le dossier `src/content/produits/`.
2. Copiez un fichier existant (par exemple `ecusson-stealth.md`) et renommez-le. Le nom du fichier devient l'adresse de la page : `ecusson-loup.md` → `/produits/ecusson-loup`. Uniquement des minuscules, des chiffres et des tirets.
3. Déposez les photos dans `src/content/produits/images/` (JPG ou PNG).
4. Remplissez l'en-tête entre les deux lignes `---` :

```yaml
---
nom: Écusson Loup
description_courte: Brodé, dos velcro, 8 cm.
prix: 12
lien_helloasso: https://www.helloasso.com/associations/amicale-psig-montargis/boutiques/…   # facultatif
photos:
  - photo: ./images/ecusson-loup.jpg
    texte_alternatif: Écusson rond brodé d'une tête de loup grise.
statut: disponible          # precommande | disponible | epuise | archive
numerotation: Tirage limité à 100   # facultatif
ordre: 10                   # plus petit = affiché plus haut
categorie: patch            # pack | patch | textile | accessoire | sticker | calendrier
premium: false              # true = mis en avant avec les packs
drop: fenrir                # facultatif : nom du fichier du drop, sans .md
---

Texte plus long, facultatif. Il s'affiche sur la page du produit.
```

- **Sans `lien_helloasso`**, le bouton renvoie vers la boutique HelloAsso entière.
- **Le texte alternatif** décrit la photo pour les personnes malvoyantes. Une phrase suffit.
- Les **packs** et les produits **premium** s'affichent toujours en premier.
- Un produit avec `drop:` n'apparaît pas dans la boutique permanente : il suit les dates du drop.

## Ajouter un drop

1. Dans `src/content/drops/`, copiez `fenrir.md` et renommez-le (`loup-garou.md` → `/drops/loup-garou`).
2. Déposez le visuel et le lookbook dans `src/content/drops/images/`.
3. Remplissez l'en-tête :

```yaml
---
nom_de_code: Loup-Garou
accroche: Une phrase courte.
visuel_principal: ./images/loup-garou.jpg
texte_alternatif: Description du visuel.
lookbook:                       # facultatif
  - photo: ./images/loup-garou-1.jpg
    legende: Porté de nuit.
date_teasing: "2027-01-10 12:00"
date_acces_anticipe: "2027-01-24 18:00"
date_ouverture: "2027-01-26 18:00"
date_cloture: "2027-02-09 23:59"
date_livraison_prevue: "2027-03-15"
faq:                            # facultatif
  - question: Une question ?
    reponse: La réponse.
---

L'histoire du drop, en quelques paragraphes courts.
```

4. Dans chaque produit du drop, ajoutez `drop: loup-garou`.

**Les dates** s'écrivent **entre guillemets**, au format `"AAAA-MM-JJ HH:MM"`, en **heure de Paris**.

### Ce que fait le site tout seul, selon les dates

| Période | Ce que voit le visiteur |
|---|---|
| Avant `date_teasing` | Le drop n'est pas annoncé |
| Teasing | Visuel flouté, compte à rebours vers l'accès anticipé, bouton « Rejoindre la liste privée » |
| Accès anticipé | Produits visibles, « Réservé à la liste privée », compte à rebours vers l'ouverture |
| Ouvert | Boutons « Acheter sur HelloAsso », compte à rebours jusqu'à la clôture, date de livraison |
| Clos | « Drop terminé », produits marqués épuisés, invitation à la liste privée |
| Après `date_livraison_prevue` | Archivé |

Le changement se fait **dans le navigateur du visiteur, à l'heure exacte**, sans republier le site.

## Photos : règles OPSEC (obligatoires)

Avant d'ajouter une photo, vérifiez :

- aucun visage non flouté (sauf accord écrit) ;
- aucune plaque lisible, aucun lieu ni local identifiable ;
- aucun écran ni document lisible ;
- aucun détail sur les procédures, les effectifs, les horaires ou l'équipement.

Les données cachées des photos (EXIF, position GPS) sont retirées automatiquement : le site ne publie que des copies recompressées des images placées dans `src/content/`. **Ne mettez jamais de photo dans `public/`** : elle serait publiée telle quelle, avec ses données.

---

## Pour les développeurs

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # site statique dans dist/
```

- Astro 7, TypeScript, CSS maison (`src/styles/global.css`, couleurs et polices en variables).
- Contenus : `src/content.config.ts` (schémas), `src/content/`.
- États des drops : `src/lib/etat-drop.ts`, partagé entre la construction et le navigateur (`src/scripts/drops.ts`).
- Polices hébergées dans `public/fonts/` (aucun appel à Google Fonts, donc rien à déclarer côté RGPD).
- Liens généraux (HelloAsso, Instagram) : `src/config.ts`.
- Page temporaire `/typographie` pour comparer les deux options de police ; `?typo=b` affiche tout le site avec l'option B.
- Les boutons portent `data-suivi="achat"` ou `data-suivi="inscription"` pour les statistiques (phase 3).
