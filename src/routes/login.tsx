import { Navigate, createFileRoute } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppHeader } from "@/components/app-header";
import { AuthPanel } from "@/components/auth-panel";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg">
        <Skeleton className="h-64 w-full max-w-sm rounded-2xl" />
      </div>
    );
  }

  if (user) return <Navigate to="/" />;

  return (
    <div className="min-h-dvh bg-bg">
      <AppHeader />
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-24">
        <h1 className="font-display text-3xl italic tracking-tight text-fg">Entra in Replay</h1>
        <p className="mt-2 mb-8 text-sm text-muted">
          Un nome utente, e sei nella bacheca.
        </p>
        <AuthPanel />
      </main>
    </div>
  );
}
