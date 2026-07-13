"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import logoNoir from "@/app/assets/logo-noir.png";
import { getClientAuth } from "@/lib/firebase-client";
import { SpinnerIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const credential = await signInWithEmailAndPassword(getClientAuth(), email, password);
      const idToken = await credential.user.getIdToken();

      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) throw new Error("session");

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-5 rounded-2xl bg-white p-8 shadow-md"
      >
        <Image src={logoNoir} alt="LUCIE" className="mx-auto h-14 w-auto object-contain" />

        <h1 className="text-center font-display text-3xl text-kings-blue-dark">
          Bossor_bii
        </h1>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="font-heading text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-kings-blue focus:ring-2 focus:ring-kings-blue/20"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="font-heading text-sm font-semibold text-slate-700">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-kings-blue focus:ring-2 focus:ring-kings-blue/20"
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-kings-red" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-kings-blue px-6 py-3 font-heading font-bold text-white transition-colors duration-200 hover:bg-kings-blue-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && <SpinnerIcon className="h-5 w-5 animate-spin motion-reduce:animate-none" />}
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
