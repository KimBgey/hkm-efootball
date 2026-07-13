export const SESSION_COOKIE_NAME = "hkm_efootball_session";

export const SESSION_MAX_AGE_MS = 5 * 24 * 60 * 60 * 1000; // 5 jours

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
