# Dr. Amel Ben Brahim, orthodontiste à Nabeul

Site vitrine du cabinet (Next.js 16, React 19, Tailwind CSS 4, Motion) avec un espace cabinet pour publier les actualités et suivre les demandes de rendez-vous.

## Démarrage

```bash
bun install
cp .env.example .env.local   # puis renseigner les valeurs
bun run db:local             # PostgreSQL 17 local (sans Docker), à laisser ouvert
bun run dev                  # dans un second terminal
```

Site : http://localhost:3000. Espace cabinet : http://localhost:3000/dashboard

Au démarrage, le serveur applique les migrations de la base. Sur une base vide, il importe l'ancien stockage JSON s'il existe (`.data/db.json` et `.data/uploads/`), sinon il crée les articles de départ.

## Variables d'environnement

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL publique (liens canoniques, sitemap, Open Graph). |
| `DATABASE_URL` | Connexion PostgreSQL : articles, demandes, comptes, images envoyées, alertes. |
| `AUTH_SECRET` | Secret de signature des sessions (32 caractères minimum). |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Identifiants de **première connexion** : ils créent le premier administrateur, puis ne donnent plus accès. |
| `ADMIN_NAME` | Nom affiché du premier administrateur (par défaut « Dr. Amel Ben Brahim »). |
| `WHATSAPP_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | Alertes WhatsApp des nouvelles demandes (voir plus bas). Vides : alertes désactivées. |
| `WHATSAPP_TEMPLATE` / `WHATSAPP_TEMPLATE_LANG` | Modèle de message approuvé par Meta (par défaut `nouvelle_demande_rdv`, `fr`). |
| `DATA_DIR` | Import unique : dossier de l'ancien stockage JSON, lu au premier démarrage sur une base vide. |

## Espace cabinet

- **Articles** : rédaction en Markdown avec barre d'outils et aperçu, image de couverture (glisser-déposer, optimisée en WebP), catégorie, mise à la une, date de publication (une date future programme l'article), titre et description SEO avec aperçu Google.
- **Demandes de RDV** : les demandes du formulaire de contact, avec appel, WhatsApp, e-mail, statut « traitée » (et par qui), état de l'alerte WhatsApp envoyée à l'équipe.
- **Utilisateurs** (administrateurs) : ajouter un membre, choisir son rôle, réinitialiser son mot de passe, le désactiver ou le supprimer. Le mot de passe temporaire s'affiche une seule fois ; la personne le remplace dans « Mon compte ».
- **Mon compte** : nom, e-mail et mot de passe de chaque membre ; pour ceux qui traitent les demandes, numéro WhatsApp, activation des alertes et message de test.
- Chaque publication rafraîchit automatiquement l'accueil, les actualités et le sitemap.

### Rôles

| Rôle | Accès |
| --- | --- |
| Administrateur | Tout, y compris la gestion des utilisateurs. |
| Rédacteur | Articles uniquement. |
| Secrétariat | Demandes de rendez-vous uniquement (données patients). |

Le cabinet garde toujours au moins un administrateur actif. Changer un mot de passe, un rôle ou désactiver un compte ferme ses sessions ouvertes.

### Accès perdu

Dans le conteneur de l'application (Coolify : onglet « Terminal »), ou en local avec `DATABASE_URL` :

```bash
bun scripts/create-admin.mjs adresse@exemple.com "Nom affiché"
```

Crée l'administrateur (ou réinitialise ce compte) et affiche un mot de passe temporaire.

## Hébergement (Coolify)

L'application est sans état : tout est dans PostgreSQL, y compris les images envoyées depuis l'espace cabinet. Aucun volume n'est nécessaire pour l'application.

1. **Base de données** : Coolify → *New Resource* → *Database* → **PostgreSQL 17**. Laisser le port privé (pas d'accès public) et activer les **sauvegardes planifiées** (quotidiennes, idéalement vers un stockage S3).
2. **Application** : renseigner les variables d'environnement, avec pour `DATABASE_URL` l'URL interne de la base (*Postgres URL (internal)*, même serveur Coolify).
3. **Déploiement** : `bun run build` n'a pas besoin de la base ; au démarrage (`bun run start`), les migrations s'appliquent automatiquement, une instance à la fois.
4. **Premier accès** : sur une base vide, les identifiants `ADMIN_EMAIL` / `ADMIN_PASSWORD` créent le premier administrateur ; les autres comptes s'ajoutent ensuite depuis « Utilisateurs ».

Après une modification de `lib/db/schema.ts` : `bun run db:generate` crée la migration SQL dans `drizzle/`, à committer avec le code.

## Alertes WhatsApp

Chaque nouvelle demande de rendez-vous est envoyée sur WhatsApp aux membres (administrateurs et secrétariat) qui ont activé les alertes dans « Mon compte ». L'envoi passe par l'**API officielle WhatsApp Business (Meta)**, ce qui évite tout risque de blocage du numéro.

1. Dans [Meta Business](https://business.facebook.com), créer le portefeuille du cabinet, puis sur [developers.facebook.com](https://developers.facebook.com) une application de type *Business* avec le produit **WhatsApp**.
2. Ajouter et vérifier le numéro d'envoi. Il ne doit pas être utilisé en parallèle dans l'application WhatsApp classique : prévoir un numéro dédié.
3. Dans *WhatsApp Manager* → *Modèles de message*, créer le modèle **`nouvelle_demande_rdv`**, catégorie **Utilité**, langue **Français (fr)** :

   ```
   Nouvelle demande de rendez-vous reçue sur le site du cabinet.

   Patient : {{1}}
   Téléphone : {{2}}
   Consultation : {{3}}
   Disponibilités : {{4}}

   Merci de rappeler le patient puis de marquer la demande comme traitée dans l'espace cabinet.
   ```

   Exemples demandés par Meta : `Sonia Trabelsi`, `+216 98 123 456`, `Adulte · Aligneurs invisibles`, `Mardi matin`. Un bouton « Visiter le site » vers `https://www.amelbenbrahim.com/dashboard/demandes` peut être ajouté (URL fixe).
4. *Paramètres de l'entreprise* → *Utilisateurs système* : créer un utilisateur système administrateur, lui attribuer l'application et le compte WhatsApp, puis générer un jeton **sans expiration** avec les autorisations `whatsapp_business_messaging` et `whatsapp_business_management` → `WHATSAPP_TOKEN`.
5. *WhatsApp* → *Configuration de l'API* : copier l'**identifiant du numéro de téléphone** → `WHATSAPP_PHONE_NUMBER_ID`.
6. Ajouter un moyen de paiement dans WhatsApp Manager (Meta facture chaque message de modèle *Utilité*, quelques centimes).
7. Redéployer, puis chaque membre concerné : « Mon compte » → « Alertes WhatsApp » → numéro, activer, **Envoyer un test**.

L'alerte part après l'enregistrement de la demande : si WhatsApp est indisponible, la demande est tout de même conservée et l'échec est signalé sur sa fiche.

## Sécurité

- **Content-Security-Policy** stricte avec un nonce par requête (`proxy.ts`) : seuls les scripts du site s'exécutent, pas d'intégration du site dans un cadre (`frame-ancestors 'none'`).
- En-têtes : `Strict-Transport-Security` (production), `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` (`next.config.ts`). L'espace cabinet est en `noindex`.
- Mots de passe hachés (scrypt), sessions signées et révocables, limitation des tentatives de connexion et des envois du formulaire.

## Contenus à vérifier

Les informations marquées `VERIFY` dans `lib/site.ts` (étage exact, WhatsApp) et les engagements listés dans `credentials` proviennent d'annuaires et des réseaux sociaux : à faire valider par le docteur. Les textes des traitements sont dans `lib/treatments.ts`, la FAQ dans `lib/faq.ts`.

## Marque

`node scripts/build-brand-assets.mjs` régénère le monogramme et la signature (masques utilisés en CSS) ainsi que l'image Open Graph `public/og/cover.jpg` à partir de `public/img`.
