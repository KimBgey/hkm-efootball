import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary, type CloudinaryFolder } from "@/lib/cloudinary";
import { isValidImageFile } from "@/lib/validation";

const VALID_FOLDERS: CloudinaryFolder[] = ["photos", "paiements"];

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file");
  const folder = formData.get("folder");

  if (typeof folder !== "string" || !VALID_FOLDERS.includes(folder as CloudinaryFolder)) {
    return NextResponse.json({ error: "Dossier invalide" }, { status: 400 });
  }
  if (!(file instanceof File) || !isValidImageFile(file)) {
    return NextResponse.json(
      { error: "Fichier invalide (jpg/png, 5MB max requis)" },
      { status: 400 }
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToCloudinary(buffer, folder as CloudinaryFolder);
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[upload] Échec Cloudinary:", error);
    return NextResponse.json({ error: "Échec de l'upload. Réessaie." }, { status: 502 });
  }
}
