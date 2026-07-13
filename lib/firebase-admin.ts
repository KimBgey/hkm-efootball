import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

let app: App | undefined;

// Initialisation volontairement paresseuse (pas au chargement du module) : le
// build Next.js importe les route handlers pour en analyser les métadonnées,
// ce qui exécuterait ce code même sans les identifiants Firebase disponibles.
function getAdminApp(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  if (useEmulators) {
    process.env.FIRESTORE_EMULATOR_HOST ||= "localhost:8080";
    process.env.FIREBASE_AUTH_EMULATOR_HOST ||= "localhost:9099";
    app = initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID || "hkm-efootball-dev",
    });
    return app;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin: variables d'environnement manquantes (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY)."
    );
  }

  app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  return app;
}

let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;

export function getAdminAuth(): Auth {
  return (authInstance ??= getAuth(getAdminApp()));
}

export function getAdminDb(): Firestore {
  return (dbInstance ??= getFirestore(getAdminApp()));
}

export const INSCRIPTIONS_COLLECTION = "hkm_efootball_inscriptions";
