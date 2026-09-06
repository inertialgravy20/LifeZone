import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getProfile } from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppHeader } from "@/components/app-header";
import { Avatar } from "@/components/ui/avatar";
import { FeedList } from "@/components/feed-list";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/u/$handle")({ component: ProfilePage });

function ProfilePage() {
  const { handle } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const profile = useQuery({
    queryKey: ["profile", handle],
    queryFn: () => getProfile({ data: { handle } }),
    enabled: Boolean(user),
  });

  if (isPending) {
    return (
      <div className="min-h-dvh bg-bg">
        <AppHeader solid />
        <main className="mx-auto max-w-xl px-4 py-8">
          <Skeleton className="h-28 rounded-2xl" />
        </main>
      </div>
    );
  }

  if (!user) return <RedirectToSignIn />;

  return (
    <div className="min-h-dvh bg-bg pb-16">
      <AppHeader solid />
      <main className="mx-auto max-w-xl px-4 py-6">
        <Link
          to="/"
          className="mb-5 inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Bacheca
        </Link>
        {profile.isPending ? (
          <Skeleton className="mb-6 h-28 rounded-2xl" />
        ) : profile.isError ? (
          <p className="text-sm text-danger">
            {profile.error instanceof Error ? profile.error.message : "Profilo non trovato."}
          </p>
        ) : profile.data ? (
          <header className="mb-6 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
            <Avatar name={profile.data.displayName} src={profile.data.avatarUrl} size="lg" />
            <div>
              <h1 className="font-display text-2xl italic tracking-tight">{profile.data.displayName}</h1>
              <p className="text-sm text-muted">@{profile.data.handle}</p>
              <p className="mt-1 text-xs tabular-nums text-subtle">
                {profile.data.postCount} {profile.data.postCount === 1 ? "post" : "post"}
              </p>
            </div>
          </header>
        ) : null}
        <FeedList handle={handle} />
      </main>
    </div>
  );
}
