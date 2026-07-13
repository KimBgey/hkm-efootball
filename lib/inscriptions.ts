import { getAdminDb, INSCRIPTIONS_COLLECTION } from "./firebase-admin";

export type Statut = "en_attente" | "valide" | "rejete";

export interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  club: string;
  photoUrl: string;
  paiementUrl: string;
  statut: Statut;
  motifRejet?: string;
  createdAt: number;
  updatedAt: number;
}

export interface JoueurValide {
  id: string;
  prenom: string;
  initiale: string;
  club: string;
  photoUrl: string;
}

export async function getValidatedJoueurs(): Promise<JoueurValide[]> {
  const snapshot = await getAdminDb()
    .collection(INSCRIPTIONS_COLLECTION)
    .where("statut", "==", "valide")
    .orderBy("updatedAt", "desc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      prenom: data.prenom as string,
      initiale: `${(data.nom as string)?.trim().charAt(0).toUpperCase()}.`,
      club: data.club as string,
      photoUrl: data.photoUrl as string,
    };
  });
}
