export const HANDLE_MIN = 3;
export const HANDLE_MAX = 20;

export function normalizeHandle(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "")
    .slice(0, HANDLE_MAX);
}

export function handleToEmail(handle: string): string {
  return `${normalizeHandle(handle)}@replay.local`;
}

export function handleHint(raw: string): string | null {
  const h = normalizeHandle(raw);
  if (!h) return "Usa lettere, numeri o underscore.";
  if (h.length < HANDLE_MIN) return `Almeno ${HANDLE_MIN} caratteri.`;
  return null;
}
