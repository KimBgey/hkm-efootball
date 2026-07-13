import { NextRequest, NextResponse } from "next/server";
import { getAdminDb, INSCRIPTIONS_COLLECTION } from "@/lib/firebase-admin";
import { normalizePhone, validateInscriptionFields } from "@/lib/validation";

function isCloudinaryUrl(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("https://res.cloudinary.com/");
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const fields = {
    nom: String(body.nom || ""),
    prenom: String(body.prenom || ""),
    telephone: String(body.telephone || ""),
    email: String(body.email || ""),
    club: String(body.club || ""),
  };

  const errors = validateInscriptionFields(fields);

  if (!isCloudinaryUrl(body.photoUrl)) {
    errors.push("La photo du joueur est requise.");
  }
  if (!isCloudinaryUrl(body.paiementUrl)) {
    errors.push("La capture d'écran du paiement est requise.");
  }

  if (errors.length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const now = Date.now();
  await getAdminDb().collection(INSCRIPTIONS_COLLECTION).add({
    ...fields,
    telephone: normalizePhone(fields.telephone),
    photoUrl: body.photoUrl,
    paiementUrl: body.paiementUrl,
    statut: "en_attente",
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
