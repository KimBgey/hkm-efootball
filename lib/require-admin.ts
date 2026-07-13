import { cookies } from "next/headers";
import { getAdminAuth } from "./firebase-admin";
import { SESSION_COOKIE_NAME } from "./session";

export async function requireAdminSession(): Promise<boolean> {
  const cookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return false;
  try {
    await getAdminAuth().verifySessionCookie(cookie, true);
    return true;
  } catch {
    return false;
  }
}
