import { Link, createFileRoute } from "@tanstack/react-router";
import { PenLine } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppHeader } from "@/components/app-header";
import { AuthPanel } from "@/components/auth-panel";
import { Composer } from "@/components/composer";
import { FeedList } from "@/components/feed-list";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div className="min-h-dvh bg-bg">
        <AppHeader solid />
        <main className="mx-auto max-w-xl px-4 py-8">
          <Skeleton className="mb-4 h-40 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!user) return <Landing />;

  return (
    <div className="min-h-dvh bg-bg pb-24">
      <AppHeader solid />
      <main className="mx-auto max-w-xl px-4 py-6 sm:px-0 sm:py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl italic tracking-tight text-fg">Bacheca</h1>
          <p className="mt-1 text-sm text-muted">
            Screenshot, clip e opinioni. Tutto in un unico posto.
          </p>
        </div>
        <div className="mb-6 hidden sm:block">
          <Composer />
        </div>
        <FeedList />
      </main>
      <Link
        to="/new"
        aria-label="Nuovo post"
        className="fixed bottom-5 right-5 z-20 inline-flex size-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-soft transition-transform duration-150 active:scale-[0.96] sm:hidden"
      >
        <PenLine className="size-6" strokeWidth={1.75} />
      </Link>
    </div>
  );
}

function Landing() {
  return (
    <div className="relative min-h-dvh bg-bg">
      <AppHeader />
      <main className="grid min-h-dvh lg:grid-cols-2">
        <section className="flex flex-col justify-center px-5 py-24 sm:px-10 lg:px-16">
          <p className="text-xs uppercase tracking-[0.22em] text-subtle">Community di giocatori</p>
          <h1 className="mt-3 max-w-md font-display text-4xl italic leading-tight tracking-tight text-fg sm:text-5xl">
            La bacheca dove restano le partite.
          </h1>
          <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
            Entra con un nome utente, pubblica screenshot e clip, leggi tutti gli altri. Like e commenti, senza rumore.
          </p>
          <div className="mt-10">
            <AuthPanel />
          </div>
        </section>
        <section className="relative hidden min-h-dvh lg:block">
          <img
            src="/seed/citadel.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/30 to-transparent" />
          <p className="absolute bottom-8 left-8 right-8 font-display text-lg italic text-fg">
            Un posto solo. Tutti i replay.
          </p>
        </section>
      </main>
    </div>
  );
}
