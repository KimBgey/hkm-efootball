import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

let authInstance: Auth | undefined;

// Lazy comme lib/firebase-admin.ts : évite d'initialiser (et donc de valider la
// config Firebase) au chargement du module, ce qui casserait le prerendering
// de /admin/login tant que les vraies clés ne sont pas fournies.
export function getClientAuth(): Auth {
  if (authInstance) return authInstance;

  const app = getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
  authInstance = getAuth(app);

  if (
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true" &&
    typeof window !== "undefined" &&
    !(authInstance as unknown as { emulatorConfig?: unknown }).emulatorConfig
  ) {
    connectAuthEmulator(authInstance, "http://localhost:9099", { disableWarnings: true });
  }

  return authInstance;
}
