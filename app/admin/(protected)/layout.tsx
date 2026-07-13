import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase-admin";
import { SESSION_COOKIE_NAME } from "@/lib/session";
import { LogoutButton } from "@/components/admin/logout-button";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookie = cookies().get(SESSION_COOKIE_NAME)?.value;

  if (!cookie) redirect("/admin/login");

  try {
    await getAdminAuth().verifySessionCookie(cookie, true);
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="flex items-center justify-between bg-kings-blue-dark px-6 py-4 text-white">
        <p className="font-display text-2xl">hkm eFootball kings — Admin</p>
        <LogoutButton />
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  );
}
