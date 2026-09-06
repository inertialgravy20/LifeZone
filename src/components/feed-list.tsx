import { useQuery } from "@tanstack/react-query";
import { listPosts } from "@/lib/api";
import { PostCard } from "@/components/post-card";
import { Skeleton } from "@/components/ui/skeleton";

export function FeedList({ handle }: { handle?: string }) {
  const feed = useQuery({
    queryKey: handle ? ["posts", handle] : ["posts"],
    queryFn: () => listPosts(handle ? { data: { handle } } : undefined),
  });

  if (feed.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (feed.isError) {
    const msg = feed.error instanceof Error ? feed.error.message : "Errore";
    if (msg === "Unauthorized") {
      return <p className="text-sm text-muted">Accedi per vedere la bacheca.</p>;
    }
    return <p className="text-sm text-danger">{msg}</p>;
  }

  const posts = feed.data ?? [];
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
        <p className="font-display text-xl italic text-fg">Ancora silenzio.</p>
        <p className="mt-2 text-sm text-muted">
          Pubblica il primo screenshot o una clip. La bacheca è di tutti.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} compact />
      ))}
    </div>
  );
}
