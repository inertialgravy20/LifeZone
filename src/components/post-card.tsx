import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePost, toggleLike, type PostDTO } from "@/lib/api";
import { formatRelative } from "@/lib/time";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function PostCard({ post, compact = false }: { post: PostDTO; compact?: boolean }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const likeMut = useMutation({
    mutationFn: () => toggleLike({ data: { postId: post.id } }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previous = queryClient.getQueriesData({ queryKey: ["posts"] });
      queryClient.setQueriesData({ queryKey: ["posts"] }, (old: unknown) => patchPosts(old, post.id, (p) => ({
        ...p,
        liked: !p.liked,
        likeCount: p.likeCount + (p.liked ? -1 : 1),
      })));
      queryClient.setQueryData(["post", post.id], (old: unknown) => {
        if (!old || typeof old !== "object" || !("post" in old)) return old;
        const rec = old as { post: PostDTO };
        return {
          ...rec,
          post: {
            ...rec.post,
            liked: !rec.post.liked,
            likeCount: rec.post.likeCount + (rec.post.liked ? -1 : 1),
          },
        };
      });
      return { previous };
    },
    onError: (err, _v, ctx) => {
      ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      toast.error(err instanceof Error ? err.message : "Like non riuscito");
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", post.id] });
    },
  });

  const delMut = useMutation({
    mutationFn: () => deletePost({ data: { id: post.id } }),
    onSuccess: () => {
      toast("Post eliminato");
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      if (!compact) void navigate({ to: "/" });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Eliminazione non riuscita"),
  });

  return (
    <article className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex items-start gap-3">
        <Link to="/u/$handle" params={{ handle: post.handle }} className="shrink-0">
          <Avatar name={post.displayName} src={post.avatarUrl} />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <Link
              to="/u/$handle"
              params={{ handle: post.handle }}
              className="truncate font-medium text-fg hover:underline"
            >
              {post.displayName}
            </Link>
            <span className="truncate text-sm text-subtle">@{post.handle}</span>
            <time
              className="ml-auto shrink-0 text-xs tabular-nums text-subtle"
              dateTime={post.createdAt}
              title={post.createdAt}
            >
              {formatRelative(post.createdAt)}
            </time>
          </div>
          {post.gameTag ? (
            <p className="mt-1">
              <span className="inline-flex rounded-full border border-line px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-muted">
                {post.gameTag}
              </span>
            </p>
          ) : null}
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-fg">{post.body}</p>
        </div>
      </div>

      {post.media.length > 0 ? (
        <div
          className={cn(
            "mt-4 overflow-hidden rounded-xl bg-raised",
            post.media.length > 1 && "grid grid-cols-2 gap-1",
          )}
        >
          {post.media.map((m) =>
            m.kind === "video" ? (
              <video
                key={m.id}
                src={m.url}
                controls
                playsInline
                preload="metadata"
                className="max-h-[480px] w-full bg-bg object-contain"
              />
            ) : (
              <img
                key={m.id}
                src={m.url}
                alt=""
                className={cn(
                  "w-full object-cover",
                  post.media.length === 1 ? "max-h-[520px] object-contain bg-bg" : "aspect-square",
                )}
              />
            ),
          )}
        </div>
      ) : null}

      <div className="mt-3 flex items-center gap-1">
        <button
          type="button"
          aria-pressed={post.liked}
          aria-label={post.liked ? "Togli mi piace" : "Metti mi piace"}
          onClick={() => likeMut.mutate()}
          className={cn(
            "inline-flex h-11 min-w-11 items-center gap-1.5 rounded-lg px-2.5 text-sm transition-[color,background-color] duration-150",
            post.liked ? "text-like" : "text-muted hover:bg-raised hover:text-fg",
          )}
        >
          <span className="relative size-5">
            <Heart
              className={cn(
                "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                post.liked ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]",
              )}
              fill="currentColor"
              strokeWidth={1.75}
            />
            <Heart
              className={cn(
                "absolute inset-0 size-5 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
                post.liked ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none",
              )}
              strokeWidth={1.75}
            />
          </span>
          <span className="tabular-nums">{post.likeCount}</span>
        </button>

        {compact ? (
          <Link
            to="/p/$postId"
            params={{ postId: String(post.id) }}
            className="inline-flex h-11 min-w-11 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
            aria-label="Commenta"
          >
            <MessageCircle className="size-5" strokeWidth={1.75} />
            <span className="tabular-nums">{post.commentCount}</span>
          </Link>
        ) : (
          <span className="inline-flex h-11 items-center gap-1.5 px-2.5 text-sm text-muted">
            <MessageCircle className="size-5" strokeWidth={1.75} />
            <span className="tabular-nums">{post.commentCount}</span>
          </span>
        )}

        {post.isOwner ? (
          <button
            type="button"
            className="ml-auto inline-flex h-11 min-w-11 items-center justify-center rounded-lg text-subtle transition-colors duration-150 hover:bg-danger/10 hover:text-danger"
            aria-label="Elimina post"
            disabled={delMut.isPending}
            onClick={() => {
              if (window.confirm("Eliminare questo post?")) delMut.mutate();
            }}
          >
            <Trash2 className="size-4" strokeWidth={1.75} />
          </button>
        ) : compact ? (
          <Link
            to="/p/$postId"
            params={{ postId: String(post.id) }}
            className="ml-auto text-xs text-subtle hover:text-muted"
          >
            Apri
          </Link>
        ) : null}
      </div>
    </article>
  );
}

function patchPosts(
  old: unknown,
  id: number,
  fn: (p: PostDTO) => PostDTO,
): unknown {
  if (!Array.isArray(old)) return old;
  return old.map((p) => (p && typeof p === "object" && "id" in p && p.id === id ? fn(p as PostDTO) : p));
}
