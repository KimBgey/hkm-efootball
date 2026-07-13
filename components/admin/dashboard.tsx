"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CloseIcon, SpinnerIcon } from "@/components/icons";
import type { Inscription, Statut } from "@/lib/inscriptions";

interface Compteurs {
  total: number;
  enAttente: number;
  valide: number;
  rejete: number;
}

const STATUT_LABELS: Record<Statut, string> = {
  en_attente: "En attente",
  valide: "Validé",
  rejete: "Rejeté",
};

const STATUT_STYLES: Record<Statut, string> = {
  en_attente: "bg-amber-100 text-amber-700",
  valide: "bg-green-100 text-green-700",
  rejete: "bg-red-100 text-red-700",
};

const FILTERS: { key: "tous" | Statut; label: string }[] = [
  { key: "tous", label: "Tous" },
  { key: "en_attente", label: "En attente" },
  { key: "valide", label: "Validé" },
  { key: "rejete", label: "Rejeté" },
];

export function AdminDashboard() {
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [compteurs, setCompteurs] = useState<Compteurs | null>(null);
  const [filter, setFilter] = useState<"tous" | Statut>("tous");
  const [loading, setLoading] = useState(true);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [motif, setMotif] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/admin/inscriptions");
    if (response.ok) {
      const data = await response.json();
      setInscriptions(data.inscriptions);
      setCompteurs(data.compteurs);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatut(id: string, statut: Statut, motifRejet?: string) {
    setPendingId(id);
    setError(null);
    try {
      const response = await fetch("/api/admin/inscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, statut, motifRejet }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error ?? "Action échouée.");
        return;
      }
      setRejectingId(null);
      setMotif("");
      await load();
    } finally {
      setPendingId(null);
    }
  }

  const filtered = inscriptions.filter((i) => filter === "tous" || i.statut === filter);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {compteurs && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <CounterCard label="Total" value={compteurs.total} />
          <CounterCard label="En attente" value={compteurs.enAttente} />
          <CounterCard label="Validés" value={compteurs.valide} />
          <CounterCard label="Rejetés" value={compteurs.rejete} />
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${
              filter === f.key
                ? "bg-kings-blue text-white"
                : "bg-white text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-kings-red" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <SpinnerIcon className="h-8 w-8 animate-spin text-kings-blue motion-reduce:animate-none" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-500">Aucune inscription ici.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((inscription) => (
            <div
              key={inscription.id}
              className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <button
                type="button"
                onClick={() => setZoomUrl(inscription.photoUrl)}
                className="relative h-20 w-20 shrink-0 cursor-pointer overflow-hidden rounded-full"
              >
                <Image src={inscription.photoUrl} alt={inscription.prenom} fill sizes="80px" className="object-cover" />
              </button>

              <div className="flex-1">
                <p className="font-heading font-bold text-slate-900">
                  {inscription.prenom} {inscription.nom}{" "}
                  <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${STATUT_STYLES[inscription.statut]}`}>
                    {STATUT_LABELS[inscription.statut]}
                  </span>
                </p>
                <p className="text-sm text-slate-600">
                  {inscription.telephone} · {inscription.email}
                </p>
                <p className="text-sm text-slate-600">Club : {inscription.club}</p>
                {inscription.statut === "rejete" && inscription.motifRejet && (
                  <p className="mt-1 text-sm text-kings-red">Motif : {inscription.motifRejet}</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => setZoomUrl(inscription.paiementUrl)}
                className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 transition-colors duration-200 hover:border-kings-blue hover:text-kings-blue"
              >
                Voir paiement
              </button>

              {inscription.statut === "en_attente" && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={pendingId === inscription.id}
                    onClick={() => updateStatut(inscription.id, "valide")}
                    className="cursor-pointer rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    disabled={pendingId === inscription.id}
                    onClick={() => setRejectingId(inscription.id)}
                    className="cursor-pointer rounded-full bg-kings-red px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {zoomUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setZoomUrl(null)}
        >
          <button
            type="button"
            onClick={() => setZoomUrl(null)}
            className="absolute right-6 top-6 cursor-pointer text-white"
            aria-label="Fermer"
          >
            <CloseIcon className="h-8 w-8" />
          </button>
          <div className="relative h-[80vh] w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={zoomUrl} alt="Aperçu" fill sizes="100vw" className="object-contain" />
          </div>
        </div>
      )}

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">
            <h3 className="mb-4 font-heading text-xl font-bold text-slate-900">Motif du rejet</h3>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-kings-blue focus:ring-2 focus:ring-kings-blue/20"
              placeholder="Explique la raison du rejet..."
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingId(null);
                  setMotif("");
                }}
                className="cursor-pointer rounded-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={!motif.trim() || pendingId === rejectingId}
                onClick={() => updateStatut(rejectingId, "rejete", motif)}
                className="cursor-pointer rounded-full bg-kings-red px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CounterCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
      <p className="font-heading text-3xl font-bold text-kings-blue-dark">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
