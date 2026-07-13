export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Numéros béninois (plan de numérotation 2024) : préfixe optionnel +229, puis 10 chiffres commençant par 01.
const PHONE_REGEX = /^(\+229)?\s?01\d{2}\s?\d{2}\s?\d{2}\s?\d{2}$/;

export function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "");
}

export function isValidBeninPhone(phone: string): boolean {
  return PHONE_REGEX.test(phone.trim());
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidImageFile(file: { type: string; size: number }): boolean {
  return ALLOWED_IMAGE_TYPES.includes(file.type) && file.size > 0 && file.size <= MAX_FILE_SIZE_BYTES;
}

export interface InscriptionFields {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  club: string;
}

export function validateInscriptionFields(fields: Partial<InscriptionFields>): string[] {
  const errors: string[] = [];
  if (!fields.nom?.trim()) errors.push("Le nom est requis.");
  if (!fields.prenom?.trim()) errors.push("Le prénom est requis.");
  if (!fields.telephone?.trim() || !isValidBeninPhone(fields.telephone)) {
    errors.push("Le numéro de téléphone doit être un numéro béninois valide (ex: +229 0155952589).");
  }
  if (!fields.email?.trim() || !isValidEmail(fields.email)) {
    errors.push("L'adresse email est invalide.");
  }
  if (!fields.club?.trim()) errors.push("Le club/équipe favori est requis.");
  return errors;
}
