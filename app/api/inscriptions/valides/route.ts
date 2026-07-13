import { NextResponse } from "next/server";
import { getValidatedJoueurs } from "@/lib/inscriptions";

export const dynamic = "force-dynamic";

export async function GET() {
  const joueurs = await getValidatedJoueurs();
  return NextResponse.json({ joueurs });
}
