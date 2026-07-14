"use client";

import { FormEvent, useRef, useState } from "react";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE_BYTES,
  isValidBeninPhone,
  isValidEmail,
} from "@/lib/validation";
import { CheckIcon, SpinnerIcon, UploadIcon } from "./icons";

interface FieldState {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  club: string;
}

const INITIAL_FIELDS: FieldState = {
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  club: "",
};

function validateFile(file: File | null, label: string): string | null {
  if (!file) return `${label} est requise.`;
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) return `${label} doit être une image jpg ou png.`;
  if (file.size > MAX_FILE_SIZE_BYTES) return `${label} ne doit pas dépasser 5MB.`;
  return null;
}

async function uploadFile(file: File, folder: "photos" | "paiements"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", { method: "POST", body: formData });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? "Échec de l'upload.");
  }
  const data = await response.json();
  return data.url as string;
}

export function RegistrationForm() {
  const [fields, setFields] = useState<FieldState>(INITIAL_FIELDS);
  const [photo, setPhoto] = useState<File | null>(null);
  const [paiement, setPaiement] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  function updateField(key: keyof FieldState, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string[] {
    const next: string[] = [];
    if (!fields.nom.trim()) next.push("Le nom est requis.");
    if (!fields.prenom.trim()) next.push("Le prénom est requis.");
    if (!isValidBeninPhone(fields.telephone)) {
      next.push("Le numéro de téléphone doit être un numéro béninois valide (ex: +229 0155952589).");
    }
    if (!isValidEmail(fields.email)) next.push("L'adresse email est invalide.");
    if (!fields.club.trim()) next.push("Le club/équipe favori est requis.");

    const photoError = validateFile(photo, "La photo du joueur");
    if (photoError) next.push(photoError);
    const paiementError = validateFile(paiement, "La capture d'écran du paiement");
    if (paiementError) next.push(paiementError);

    return next;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (validationErrors.length > 0) return;

    setStatus("loading");
    try {
      const [photoUrl, paiementUrl] = await Promise.all([
        uploadFile(photo as File, "photos"),
        uploadFile(paiement as File, "paiements"),
      ]);

      const response = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, photoUrl, paiementUrl }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setErrors(data.errors ?? ["L'envoi a échoué. Réessaie."]);
        setStatus("error");
        return;
      }

      setStatus("success");
      setFields(INITIAL_FIELDS);
      setPhoto(null);
      setPaiement(null);
      formRef.current?.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Envoi échoué (connexion instable ?). Réessaie.";
      setErrors([message]);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border-2 border-kings-blue/20 bg-white p-10 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600">
          <CheckIcon className="h-7 w-7" />
        </div>
        <h3 className="font-heading text-2xl font-bold text-slate-900">
          Inscription envoyée !
        </h3>
        <p className="text-slate-600">
          Ta demande sera validée manuellement sous 24-48h. Tu recevras un email de confirmation
          (ou de rejet avec le motif) dès que ce sera fait.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto flex max-w-3xl flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2 md:gap-x-6">
        <Field label="Nom" htmlFor="nom">
          <input
            id="nom"
            name="nom"
            type="text"
            value={fields.nom}
            onChange={(e) => updateField("nom", e.target.value)}
            className={inputClass}
            required
          />
        </Field>

        <Field label="Prénom" htmlFor="prenom">
          <input
            id="prenom"
            name="prenom"
            type="text"
            value={fields.prenom}
            onChange={(e) => updateField("prenom", e.target.value)}
            className={inputClass}
            required
          />
        </Field>

        <Field label="Téléphone" htmlFor="telephone">
          <input
            id="telephone"
            name="telephone"
            type="tel"
            placeholder="+229 0155952589"
            value={fields.telephone}
            onChange={(e) => updateField("telephone", e.target.value)}
            className={inputClass}
            required
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            value={fields.email}
            onChange={(e) => updateField("email", e.target.value)}
            className={inputClass}
            required
          />
        </Field>

        <div className="md:col-span-2">
          <Field label="Club / équipe favori" htmlFor="club">
            <input
              id="club"
              name="club"
              type="text"
              value={fields.club}
              onChange={(e) => updateField("club", e.target.value)}
              className={inputClass}
              required
            />
          </Field>
        </div>
      </div>

      <div className="rounded-xl bg-kings-blue/5 p-4">
        <p className="mb-3 text-sm text-slate-600">
          Envoie 10.000 F CFA via Momo au{" "}
          <span className="font-semibold">+229 01 56 22 89 50</span> ou via moov money{" "}
          <span className="font-semibold">+229 01 55 95 25 89</span>, puis dépose la capture d&apos;écran de
          paiement ci-dessous, avec la photo du joueur.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <FileField label="Photo du joueur" id="photo" file={photo} onChange={setPhoto} />
          <FileField
            label="Capture d'écran du paiement"
            id="paiement"
            file={paiement}
            onChange={setPaiement}
          />
        </div>
      </div>

      {errors.length > 0 && (
        <ul className="rounded-lg bg-red-50 p-4 text-sm text-kings-red" role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-kings-red px-6 py-4 font-heading text-lg font-bold uppercase tracking-wide text-white shadow-md transition-colors duration-200 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" && <SpinnerIcon className="h-5 w-5 animate-spin motion-reduce:animate-none" />}
        {status === "loading" ? "Envoi en cours..." : "Valider mon inscription"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-3 text-base text-slate-900 outline-none transition-colors duration-200 focus:border-kings-blue focus:ring-2 focus:ring-kings-blue/20";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-heading text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function FileField({
  label,
  id,
  file,
  onChange,
}: {
  label: string;
  id: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <Field label={label} htmlFor={id}>
      <label
        htmlFor={id}
        className="flex w-full max-w-full cursor-pointer items-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-slate-300 px-3 py-2.5 text-sm text-slate-600 transition-colors duration-200 hover:border-kings-blue hover:text-kings-blue sm:gap-3 sm:px-4 sm:py-3"
      >
        <UploadIcon className="h-5 w-5 shrink-0" />
        <span className="min-w-0 flex-1 truncate">
          {file ? file.name : "Choisir une image (max 5MB)"}
        </span>
      </label>
      <input
        id={id}
        name={id}
        type="file"
        accept="image/png,image/jpeg"
        className="sr-only"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </Field>
  );
}
