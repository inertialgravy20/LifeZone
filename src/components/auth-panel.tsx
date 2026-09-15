import { useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { claimHandle } from "@/lib/api";
import { authFetchHooks, persistAuthToken } from "@/lib/capture-auth-token";
import {
  HANDLE_MAX,
  HANDLE_MIN,
  PASSWORD_MIN,
  handleHint,
  handleToEmail,
  loginIdentifierToEmail,
  normalizeHandle,
} from "@/lib/handles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthPanel({ defaultMode = "login" }: { defaultMode?: "login" | "join" }) {
  const [mode, setMode] = useState<"login" | "join">(defaultMode);
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const hint = handleHint(handle);
  const canSubmit =
    !hint && password.length >= PASSWORD_MIN && !pending && authEnabled;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const clean = normalizeHandle(handle);
    const email = mode === "join" ? handleToEmail(clean) : loginIdentifierToEmail(handle);
    if (mode === "join" && !clean) {
      setError("Scegli un nome utente.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const hooks = authFetchHooks();
      if (mode === "join") {
        const { data, error: signErr } = await authClient.signUp.email(
          { email, password, name: clean },
          hooks,
        );
        if (signErr) throw new Error(mapAuthError(signErr.message, "join"));
        persistAuthToken(data?.token);
        await authClient.getSession();
        await claimHandle({ data: { handle: clean } });
      } else {
        const { data, error: signErr } = await authClient.signIn.email(
          { email, password, rememberMe: true },
          hooks,
        );
        if (signErr) throw new Error(mapAuthError(signErr.message, "login"));
        persistAuthToken(data?.token);
        await authClient.getSession();
      }
      window.location.assign("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qualcosa è andato storto.");
      setPending(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 flex gap-1 rounded-xl bg-raised p-1">
        <button
          type="button"
          className={tabClass(mode === "login")}
          onClick={() => {
            setMode("login");
            setError(null);
          }}
        >
          Entra
        </button>
        <button
          type="button"
          className={tabClass(mode === "join")}
          onClick={() => {
            setMode("join");
            setError(null);
          }}
        >
          Registrati
        </button>
      </div>

      {authEnabled ? (
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label htmlFor="handle" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-subtle">
              {mode === "join" ? "Nome utente" : "Nome utente o email"}
            </label>
            <Input
              id="handle"
              autoComplete="username"
              value={handle}
              maxLength={mode === "join" ? HANDLE_MAX + 4 : 80}
              onChange={(e) => setHandle(e.target.value)}
              placeholder={mode === "join" ? "es. mara_91" : "mara_91"}
            />
            {handle && hint ? <p className="mt-1.5 text-xs text-danger">{hint}</p> : null}
            {mode === "join" ? (
              <p className="mt-1.5 text-xs text-subtle">
                {HANDLE_MIN}–{HANDLE_MAX} caratteri, lettere e numeri.
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-subtle">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "join" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={`Almeno ${PASSWORD_MIN} caratteri`}
            />
          </div>
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" className="w-full" size="lg" disabled={!canSubmit}>
            {pending ? "Attendi…" : mode === "join" ? "Crea account" : "Entra"}
          </Button>
        </form>
      ) : (
        <p className="text-sm text-muted">L’accesso non è disponibile.</p>
      )}

      {authEnabled ? (
        <>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-subtle">
            <span className="h-px flex-1 bg-line" />
            oppure
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="flex flex-col gap-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                variant="outline"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Continua con {p.label}
              </Button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function tabClass(active: boolean) {
  return [
    "h-10 flex-1 rounded-lg text-sm font-medium transition-colors duration-150",
    active ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg",
  ].join(" ");
}

function mapAuthError(message: string | undefined, mode: "login" | "join"): string {
  const raw = message ?? "";
  const m = raw.toLowerCase();
  if (m.includes("invalid origin")) {
    return "Origine non valida. Ricarica la pagina e riprova.";
  }
  if (m.includes("invalid email") || (m.includes("email") && m.includes("invalid"))) {
    return "Email o nome utente non valido.";
  }
  if (m.includes("too short") || (m.includes("password") && m.includes("short"))) {
    return `La password deve avere almeno ${PASSWORD_MIN} caratteri.`;
  }
  if (m.includes("invalid") || m.includes("credential") || m.includes("unauthorized")) {
    return mode === "login" ? "Nome utente o password non corretti." : "Dati non validi.";
  }
  if (m.includes("exist") || m.includes("already")) {
    return "Questo nome utente è già registrato. Prova ad entrare.";
  }
  if (m.includes("password")) return `La password deve avere almeno ${PASSWORD_MIN} caratteri.`;
  return raw || "Accesso non riuscito.";
}
