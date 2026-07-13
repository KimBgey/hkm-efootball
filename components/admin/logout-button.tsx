"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="cursor-pointer rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-white/20"
    >
      Déconnexion
    </button>
  );
}
