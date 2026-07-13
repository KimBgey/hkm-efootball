import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_MS, sessionCookieOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  const { idToken } = await request.json();

  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "idToken manquant" }, { status: 400 });
  }

  try {
    // Vérifie que le token est récent (login effectif) avant de créer la session.
    await getAdminAuth().verifyIdToken(idToken);
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_MAX_AGE_MS,
    });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      ...sessionCookieOptions,
      maxAge: SESSION_MAX_AGE_MS / 1000,
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Authentification invalide" }, { status: 401 });
  }
}
