import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/lib/api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppHeader } from "@/components/app-header";
import { CommentThread } from "@/components/comment-thread";
import { PostCard } from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/p/$postId")({ component: PostPage });

function PostPage() {
  const { postId } = Route.useParams();
  const id = Number(postId);
  const { user, isPending } = useCurrentUserState();
  const query = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPost({ data: { id } }),
    enabled: Boolean(user) && Number.isFinite(id),
  });

  if (isPending) {
    return (
      <div className="min-h-dvh bg-bg">
        <AppHeader solid />
        <main className="mx-auto max-w-xl px-4 py-8">
          <Skeleton className="h-80 rounded-2xl" />
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
        {query.isPending ? (
          <Skeleton className="h-80 rounded-2xl" />
        ) : query.isError ? (
          <p className="text-sm text-danger">
            {query.error instanceof Error ? query.error.message : "Post non trovato."}
          </p>
        ) : query.data ? (
          <>
            <PostCard post={query.data.post} />
            <CommentThread postId={id} comments={query.data.comments} />
          </>
        ) : null}
      </main>
    </div>
  );
}
