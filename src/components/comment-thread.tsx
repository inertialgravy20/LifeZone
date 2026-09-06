import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addComment, deleteComment, type CommentDTO } from "@/lib/api";
import { formatRelative } from "@/lib/time";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommentThread({
  postId,
  comments,
}: {
  postId: number;
  comments: CommentDTO[];
}) {
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");

  const addMut = useMutation({
    mutationFn: () => addComment({ data: { postId, body: body.trim() } }),
    onSuccess: () => {
      setBody("");
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Commento non inviato"),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => deleteComment({ data: { id } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["post", postId] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Eliminazione non riuscita"),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || addMut.isPending) return;
    addMut.mutate();
  }

  return (
    <section className="mt-6">
      <h2 className="font-display text-lg italic text-fg">
        Commenti{" "}
        <span className="font-sans text-sm not-italic text-subtle tabular-nums">
          {comments.length}
        </span>
      </h2>
      <ul className="mt-4 space-y-4">
        {comments.length === 0 ? (
          <li className="text-sm text-muted">Nessun commento. Apri la conversazione.</li>
        ) : (
          comments.map((c) => (
            <li key={c.id} className="flex gap-3">
              <Link to="/u/$handle" params={{ handle: c.handle }} className="shrink-0">
                <Avatar name={c.displayName} src={c.avatarUrl} size="sm" />
              </Link>
              <div className="min-w-0 flex-1 rounded-xl bg-raised px-3 py-2.5">
                <div className="flex items-baseline gap-2">
                  <Link
                    to="/u/$handle"
                    params={{ handle: c.handle }}
                    className="truncate text-sm font-medium text-fg hover:underline"
                  >
                    {c.displayName}
                  </Link>
                  <time className="text-xs text-subtle tabular-nums">{formatRelative(c.createdAt)}</time>
                  {c.isOwner ? (
                    <button
                      type="button"
                      className="ml-auto text-xs text-subtle hover:text-danger"
                      onClick={() => delMut.mutate(c.id)}
                    >
                      Elimina
                    </button>
                  ) : null}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-fg">{c.body}</p>
              </div>
            </li>
          ))
        )}
      </ul>
      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <label htmlFor="comment-body" className="sr-only">
          Nuovo commento
        </label>
        <Textarea
          id="comment-body"
          value={body}
          maxLength={800}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Scrivi un commento…"
          className="min-h-24"
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!body.trim() || addMut.isPending}>
            {addMut.isPending ? "Invio…" : "Commenta"}
          </Button>
        </div>
      </form>
    </section>
  );
}
