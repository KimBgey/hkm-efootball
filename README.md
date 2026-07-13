# hkm eFootball Kings

Landing page + panel admin pour le tournoi eFootball (PS3) du 08 Août 2026 à Calavi Parana.
Next.js 14 (App Router) + Tailwind CSS + Firebase (Firestore/Auth via Admin SDK) + Cloudinary (upload photos) + Nodemailer.

## Démarrage

```bash
npm install
cp .env.local.example .env.local   # puis renseigner les variables (voir ci-dessous)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Configuration Firebase

1. Copier `.env.local.example` vers `.env.local`.
2. Dans la console Firebase du projet **existant** (partagé avec les autres apps) :
   - **Paramètres du projet > Comptes de service > Générer une nouvelle clé privée** → remplit `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`.
   - **Paramètres du projet > Général** → remplit `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`.
3. Créer manuellement le compte admin dans **Authentication > Utilisateurs** (email/mot de passe) — c'est le seul moyen de se connecter à `/admin`, il n'y a pas d'inscription.
4. Déployer les règles et l'index Firestore une fois `.firebaserc` pointé sur le vrai projet (`"default": "<project-id>"`) :
   ```bash
   npx firebase deploy --only firestore:rules,firestore:indexes
   ```
   (Les règles refusent tout accès direct : toutes les lectures/écritures passent par les API routes Next.js avec le SDK Admin.)

## Configuration Cloudinary (upload des photos)

Les photos de joueur et captures de paiement sont uploadées vers Cloudinary (pas Firebase Storage). Depuis le [dashboard Cloudinary](https://cloudinary.com/console), copier **Cloud name**, **API Key** et **API Secret** dans `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Les fichiers sont rangés dans `hkm-efootball/photos` et `hkm-efootball/paiements` sur Cloudinary.

## Configuration Gmail SMTP

`SMTP_USER` = adresse Gmail, `SMTP_APP_PASSWORD` = un [mot de passe d'application](https://myaccount.google.com/apppasswords) (pas le mot de passe du compte). Sans ces variables, les emails de validation/rejet sont simplement loggés en console (l'action admin n'est jamais bloquée par un échec d'envoi).

## Tester en local avec les émulateurs Firebase (sans toucher au vrai projet)

```bash
# Terminal 1
npx firebase emulators:start

# Terminal 2
# Dans .env.local : NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
npm run dev
```

L'UI des émulateurs est sur [http://localhost:4000](http://localhost:4000) — utile pour créer un compte admin de test (Authentication) et inspecter les documents Firestore créés par le formulaire d'inscription (les photos, elles, partent vers Cloudinary même en local).

## Image Open Graph

`app/layout.tsx` référence `/public/og-image.jpg` pour le partage Facebook/WhatsApp — exporter l'affiche du tournoi en JPG/PNG (idéalement 1200×1500) et la déposer dans `public/og-image.jpg`.

## Déploiement

Déployer sur [Vercel](https://vercel.com/new) et renseigner les mêmes variables d'environnement que dans `.env.local` (Project Settings > Environment Variables).
