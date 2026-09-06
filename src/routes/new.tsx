import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppHeader } from "@/components/app-header";
import { Composer } from "@/components/composer";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/new")({ component: NewPost });

function NewPost() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return (
      <div className="min-h-dvh bg-bg">
        <AppHeader solid />
        <main className="mx-auto max-w-xl px-4 py-8">
          <Skeleton className="h-56 rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-dvh bg-bg">
      <AppHeader solid />
      <main className="mx-auto max-w-xl px-4 py-6">
        <Link
          to="/"
          className="mb-5 inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Bacheca
        </Link>
        <h1 className="mb-4 font-display text-3xl italic tracking-tight">Nuovo post</h1>
        <Composer
          autofocus
          onPublished={(id) => {
            void navigate({ to: "/p/$postId", params: { postId: String(id) } });
          }}
        />
      </main>
    </div>
  );
}
