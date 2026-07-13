import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, INSCRIPTIONS_COLLECTION } from "@/lib/firebase-admin";
import type { Inscription } from "@/lib/inscriptions";
import { requireAdminSession } from "@/lib/require-admin";
import { sendRejectionEmail, sendValidationEmail } from "@/lib/mailer";

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const snapshot = await getAdminDb()
    .collection(INSCRIPTIONS_COLLECTION)
    .orderBy("createdAt", "desc")
    .get();

  const inscriptions: Inscription[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      email: data.email,
      club: data.club,
      photoUrl: data.photoUrl,
      paiementUrl: data.paiementUrl,
      statut: data.statut,
      motifRejet: data.motifRejet,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  });

  const compteurs = {
    total: inscriptions.length,
    enAttente: inscriptions.filter((i) => i.statut === "en_attente").length,
    valide: inscriptions.filter((i) => i.statut === "valide").length,
    rejete: inscriptions.filter((i) => i.statut === "rejete").length,
  };

  return NextResponse.json({ inscriptions, compteurs });
}

// Note : passe l'id dans le corps (plutôt qu'un segment dynamique /[id]) pour
// contourner un bug de Next.js 14.2.35 sur Windows qui casse la collecte de
// page data des routes API avec segment dynamique ("Cannot find module for
// page: /api/admin/inscriptions/[id]").
export async function PATCH(request: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { id, statut, motifRejet } = await request.json();

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  }
  if (statut !== "valide" && statut !== "rejete") {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }
  if (statut === "rejete" && !motifRejet?.trim()) {
    return NextResponse.json({ error: "Le motif du rejet est requis" }, { status: 400 });
  }

  const docRef = getAdminDb().collection(INSCRIPTIONS_COLLECTION).doc(id);
  const doc = await docRef.get();
  if (!doc.exists) {
    return NextResponse.json({ error: "Inscription introuvable" }, { status: 404 });
  }
  const data = doc.data()!;

  await docRef.update({
    statut,
    motifRejet: statut === "rejete" ? motifRejet.trim() : null,
    updatedAt: Date.now(),
  });

  if (statut === "valide") {
    await sendValidationEmail(data.email, data.prenom);
  } else {
    await sendRejectionEmail(data.email, data.prenom, motifRejet.trim());
  }

  return NextResponse.json({ ok: true });
}
