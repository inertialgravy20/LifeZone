export const HANDLE_MIN = 3;
export const HANDLE_MAX = 20;
export const PASSWORD_MIN = 8;

const EMAIL_DOMAIN = "lifezone.app";

export function normalizeHandle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, HANDLE_MAX);
}

export function handleToEmail(handle: string): string {
  return `${normalizeHandle(handle)}@${EMAIL_DOMAIN}`;
}

/** Username, or a full email if the visitor types one. */
export function loginIdentifierToEmail(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  return handleToEmail(trimmed);
}

export function handleHint(raw: string): string | null {
  if (raw.trim().includes("@")) {
    const email = raw.trim();
    if (!/^[\s@]+@[\s@]+\.[\s@]+$/.test(email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Email non valida.";
    return null;
  }
  const h = normalizeHandle(raw);
  if (!h) return "Usa lettere, numeri o underscore.";
  if (h.length < HANDLE_MIN) return `Almeno ${HANDLE_MIN} caratteri.`;
  return null;
}
