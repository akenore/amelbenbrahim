# Dr. Amel Ben Brahim, orthodontiste à Nabeul

Site vitrine du cabinet (Next.js 16, React 19, Tailwind CSS 4, Motion) avec un espace cabinet pour publier les actualités et suivre les demandes de rendez-vous.

## Démarrage

```bash
bun install
cp .env.example .env.local   # puis renseigner les valeurs
bun run dev
```

Site : http://localhost:3000. Espace cabinet : http://localhost:3000/dashboard

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (liens canoniques, sitemap, Open Graph). |
| `AUTH_SECRET` | Secret de signature des sessions (32 caractères minimum). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Identifiants de **première connexion** : ils créent le premier administrateur, puis ne donnent plus accès. |
| `ADMIN_NAME` | Nom affiché du premier administrateur (par défaut « Dr. Amel Ben Brahim »). |
| `DATA_DIR` | Dossier des données (articles, demandes, comptes, images envoyées). Par défaut `./.data`. |

## Espace cabinet

- **Articles** : rédaction en Markdown avec barre d'outils et aperçu, image de couverture (glisser-déposer, optimisée en WebP), catégorie, mise à la une, date de publication (une date future programme l'article), titre et description SEO avec aperçu Google.
- **Demandes de RDV** : les demandes du formulaire de contact, avec appel, WhatsApp, e-mail, statut « traitée ».
- **Utilisateurs** (administrateurs) : ajouter un membre, choisir son rôle, réinitialiser son mot de passe, le désactiver ou le supprimer. Le mot de passe temporaire s'affiche une seule fois ; la personne le remplace dans « Mon compte ».
- **Mon compte** : nom, e-mail et mot de passe de chaque membre.
- Chaque publication rafraîchit automatiquement l'accueil, les actualités et le sitemap.

### Rôles

| Rôle | Accès |
| --- | --- |
| Administrateur | Tout, y compris la gestion des utilisateurs. |
| Rédacteur | Articles uniquement. |
| Secrétariat | Demandes de rendez-vous uniquement (données patients). |

Le cabinet garde toujours au moins un administrateur actif. Changer un mot de passe, un rôle ou désactiver un compte ferme ses sessions ouvertes.

### Accès perdu

Sur le serveur, depuis le dossier du projet :

```bash
node scripts/create-admin.mjs adresse@exemple.com "Nom affiché"
```

Crée l'administrateur (ou réinitialise ce compte) et affiche un mot de passe temporaire.

## Hébergement

Le site a besoin d'un serveur Node.js (`bun run build` puis `bun run start`) et d'un **dossier persistant** pour `DATA_DIR` : VPS, hébergement Node.js ou conteneur avec volume. Les plateformes serverless sans disque persistant (Vercel, Netlify) ne conviennent pas au stockage fichier : il faudrait alors brancher une base de données dans `lib/data/store.ts`.

Sauvegarder régulièrement le dossier `DATA_DIR`.

## Contenus à vérifier

Les informations marquées `VERIFY` dans `lib/site.ts` (étage exact, WhatsApp) et les engagements listés dans `credentials` proviennent d'annuaires et des réseaux sociaux : à faire valider par le docteur. Les textes des traitements sont dans `lib/treatments.ts`, la FAQ dans `lib/faq.ts`.

## Marque

`node scripts/build-brand-assets.mjs` régénère le monogramme et la signature (masques utilisés en CSS) ainsi que l'image Open Graph `public/og/cover.jpg` à partir de `public/img`.
