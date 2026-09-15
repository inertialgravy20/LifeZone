/**
 * Live-preview iframe cookies are partitioned, so email/password sign-in
 * must persist Better Auth's session token the same way the OAuth popup
 * does (`grok-auth.bearer-token` in sessionStorage — see `@/lib/auth/client`).
 */
const BEARER_KEY = "grok-auth.bearer-token";

export function persistAuthToken(token: string | null | undefined): void {
  if (!token || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(BEARER_KEY, token);
  } catch {
    /* storage unavailable */
  }
}

export function persistAuthTokenFromHeaders(headers: Headers | null | undefined): void {
  if (!headers) return;
  persistAuthToken(headers.get("set-auth-token") ?? headers.get("Set-Auth-Token"));
}

export function captureAuthSession(ctx: {
  response?: Response;
  data?: unknown;
}): void {
  persistAuthTokenFromHeaders(ctx.response?.headers);
  if (ctx.data && typeof ctx.data === "object" && "token" in ctx.data) {
    const token = (ctx.data as { token?: unknown }).token;
    if (typeof token === "string") persistAuthToken(token);
  }
}

export function authFetchHooks() {
  return {
    onSuccess(ctx: { response?: Response; data?: unknown }) {
      captureAuthSession(ctx);
    },
  };
}
