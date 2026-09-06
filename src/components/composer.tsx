import { useRef, useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { createPost } from "@/lib/api";
import { mediaLimitLabel, prepareFiles, type PreparedMedia } from "@/lib/media-client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const GENRES = [
  "Souls-like",
  "RPG",
  "FPS",
  "Racing",
  "Indie",
  "Esplorazione",
  "Avventura",
  "Strategia",
  "Horror",
  "Sport",
];

type Preview = { url: string; kind: "image" | "video"; name: string };

export function Composer({
  onPublished,
  autofocus = false,
}: {
  onPublished?: (id: number) => void;
  autofocus?: boolean;
}) {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [body, setBody] = useState("");
  const [gameTag, setGameTag] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<Preview[]>([]);
  const [busy, setBusy] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: {
      body: string;
      gameTag?: string;
      media: PreparedMedia[];
    }) => createPost({ data: payload }),
    onSuccess: (res) => {
      toast("Post pubblicato");
      setBody("");
      setGameTag("");
      clearFiles();
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["me"] });
      onPublished?.(res.id);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Pubblicazione non riuscita");
    },
  });

  function clearFiles() {
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setPreviews([]);
    setFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  }

  function onPick(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next = Array.from(list).slice(0, 4);
    previews.forEach((p) => URL.revokeObjectURL(p.url));
    setFiles(next);
    setPreviews(
      next.map((f) => ({
        url: URL.createObjectURL(f),
        kind: f.type.startsWith("video/") ? "video" : "image",
        name: f.name,
      })),
    );
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!body.trim() || busy || mutation.isPending) return;
    setBusy(true);
    try {
      const media = await prepareFiles(files);
      await mutation.mutateAsync({
        body: body.trim(),
        gameTag: gameTag.trim() || undefined,
        media,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "File non validi");
    } finally {
      setBusy(false);
    }
  }

  const pending = busy || mutation.isPending;

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5"
    >
      <label className="sr-only" htmlFor="post-body">
        Testo del post
      </label>
      <Textarea
        id="post-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={2000}
        autoFocus={autofocus}
        placeholder="Cosa stai giocando? Una clip, uno screenshot, un’opinione."
        className="min-h-28 border-transparent bg-transparent px-0 py-0 placeholder:text-muted focus:ring-0"
      />
      {previews.length > 0 ? (
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {previews.map((p) => (
            <li key={p.url} className="relative overflow-hidden rounded-lg bg-raised">
              {p.kind === "video" ? (
                <video src={p.url} className="aspect-square w-full object-cover" muted />
              ) : (
                <img src={p.url} alt="" className="aspect-square w-full object-cover" />
              )}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="game-tag" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-subtle">
            Gioco (opzionale)
          </label>
          <Input
            id="game-tag"
            list="genre-list"
            value={gameTag}
            maxLength={40}
            onChange={(e) => setGameTag(e.target.value)}
            placeholder="Souls-like, Racing…"
          />
          <datalist id="genre-list">
            {GENRES.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>
        <div className="flex items-center gap-2">
          <input
            id="post-files"
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            onChange={(e) => onPick(e.target.files)}
          />
          <Button
            variant="outline"
            size="icon"
            aria-label="Allega immagini o video"
            onClick={() => fileRef.current?.click()}
          >
            <ImagePlus className="size-5" strokeWidth={1.75} />
          </Button>
          {previews.length > 0 ? (
            <Button variant="ghost" size="icon" aria-label="Rimuovi allegati" onClick={clearFiles}>
              <X className="size-5" />
            </Button>
          ) : null}
          <Button type="submit" disabled={!body.trim() || pending} className="min-w-28">
            {pending ? <LoaderCircle className="size-4 animate-spin" /> : "Pubblica"}
          </Button>
        </div>
      </div>
      <p className="mt-2 text-xs text-subtle">{mediaLimitLabel()}</p>
    </form>
  );
}
