import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql, type Sql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { HANDLE_MAX, HANDLE_MIN, normalizeHandle } from "@/lib/handles";

export type MediaDTO = {
  id: number;
  kind: "image" | "video";
  url: string;
};

export type PostDTO = {
  id: number;
  body: string;
  gameTag: string | null;
  createdAt: string;
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  likeCount: number;
  commentCount: number;
  liked: boolean;
  media: MediaDTO[];
  isOwner: boolean;
};

export type CommentDTO = {
  id: number;
  body: string;
  createdAt: string;
  userId: string;
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  isOwner: boolean;
};

export type ProfileDTO = {
  handle: string;
  displayName: string;
  avatarUrl: string | null;
  postCount: number;
  isSelf: boolean;
};

type ProfileRow = {
  handle: string;
  display_name: string;
  avatar_url: string | null;
};

function toIso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? value : d.toISOString();
  }
  return new Date().toISOString();
}

function mediaUrl(id: number, publicPath: string | null): string {
  return publicPath && publicPath.length > 0 ? publicPath : `/api/media/${id}`;
}

async function ensureProfile(sql: Sql, userId: string): Promise<ProfileRow> {
  const existing = await sql<ProfileRow>`
    select handle, display_name, avatar_url from profiles where user_id = ${userId}
  `;
  if (existing[0]) return existing[0];

  const users = await sql<{ name: string | null; image: string | null }>`
    select "name", "image" from "user" where "id" = ${userId}
  `;
  const name = users[0]?.name?.trim() || "Player";
  const avatar = users[0]?.image ?? null;
  let base = normalizeHandle(name) || "player";
  if (base.length < HANDLE_MIN) base = `${base}player`.slice(0, HANDLE_MAX);

  for (let i = 0; i < 40; i += 1) {
    const handle = i === 0 ? base : `${base.slice(0, HANDLE_MAX - 2)}${i + 1}`.slice(0, HANDLE_MAX);
    const taken = await sql<{ handle: string }>`
      select handle from profiles where handle = ${handle} limit 1
    `;
    if (taken[0]) continue;
    try {
      await sql`
        insert into profiles (user_id, handle, display_name, avatar_url)
        values (${userId}, ${handle}, ${name.slice(0, 48)}, ${avatar})
      `;
      return { handle, display_name: name.slice(0, 48), avatar_url: avatar };
    } catch {
      const again = await sql<ProfileRow>`
        select handle, display_name, avatar_url from profiles where user_id = ${userId}
      `;
      if (again[0]) return again[0];
    }
  }
  throw new Error("Impossibile creare il profilo.");
}

type PostRow = {
  id: number;
  user_id: string;
  body: string;
  game_tag: string | null;
  created_at: unknown;
  handle: string | null;
  display_name: string | null;
  avatar_url: string | null;
  like_count: number | string;
  comment_count: number | string;
  liked: boolean | number | string | null;
};

async function attachMedia(sql: Sql, posts: PostDTO[]): Promise<PostDTO[]> {
  if (posts.length === 0) return posts;
  const ids = posts.map((p) => p.id);
  const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
  const rows = await sql.query<{
    id: number;
    post_id: number;
    kind: "image" | "video";
    public_path: string | null;
  }>(
    `select id, post_id, kind, public_path from post_media where post_id in (${placeholders}) order by id asc`,
    ids,
  );
  const byPost = new Map<number, MediaDTO[]>();
  for (const row of rows) {
    const list = byPost.get(row.post_id) ?? [];
    list.push({
      id: row.id,
      kind: row.kind,
      url: mediaUrl(row.id, row.public_path),
    });
    byPost.set(row.post_id, list);
  }
  return posts.map((p) => ({ ...p, media: byPost.get(p.id) ?? [] }));
}

function mapPost(row: PostRow, viewerId: string): PostDTO {
  return {
    id: Number(row.id),
    body: row.body,
    gameTag: row.game_tag,
    createdAt: toIso(row.created_at),
    userId: row.user_id,
    handle: row.handle ?? "utente",
    displayName: row.display_name ?? "Utente",
    avatarUrl: row.avatar_url,
    likeCount: Number(row.like_count) || 0,
    commentCount: Number(row.comment_count) || 0,
    liked: row.liked === true || row.liked === 1 || row.liked === "t",
    media: [],
    isOwner: row.user_id === viewerId,
  };
}

const postSelect = `
  p.id, p.user_id, p.body, p.game_tag, p.created_at,
  pr.handle, pr.display_name, pr.avatar_url,
  (select count(*) from likes l where l.post_id = p.id) as like_count,
  (select count(*) from comments c where c.post_id = p.id) as comment_count,
  exists(select 1 from likes l where l.post_id = p.id and l.user_id = $1) as liked
`;

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const profile = await ensureProfile(sql, context.userId);
    const counts = await sql<{ n: number | string }>`
      select count(*) as n from posts where user_id = ${context.userId}
    `;
    const dto: ProfileDTO = {
      handle: profile.handle,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      postCount: Number(counts[0]?.n) || 0,
      isSelf: true,
    };
    return dto;
  });

export const claimHandle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      handle: z.string().min(1).max(40),
    }),
  )
  .handler(async ({ context, data }) => {
    const handle = normalizeHandle(data.handle);
    if (handle.length < HANDLE_MIN) {
      throw new Error(`Il nome utente deve avere almeno ${HANDLE_MIN} caratteri.`);
    }
    const sql = await getSql();
    const taken = await sql<{ user_id: string }>`
      select user_id from profiles where handle = ${handle} limit 1
    `;
    if (taken[0] && taken[0].user_id !== context.userId) {
      throw new Error("Questo nome utente è già in uso.");
    }
    const users = await sql<{ name: string | null; image: string | null }>`
      select "name", "image" from "user" where "id" = ${context.userId}
    `;
    const display = users[0]?.name?.trim() || handle;
    const avatar = users[0]?.image ?? null;
    await sql`
      insert into profiles (user_id, handle, display_name, avatar_url)
      values (${context.userId}, ${handle}, ${display.slice(0, 48)}, ${avatar})
      on conflict (user_id) do update set handle = excluded.handle
    `;
    return { handle };
  });

export const listPosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(
    z
      .object({
        handle: z.string().min(1).max(HANDLE_MAX).optional(),
      })
      .optional(),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const handle = data?.handle ? normalizeHandle(data.handle) : null;
    const rows = handle
      ? await sql.query<PostRow>(
          `select ${postSelect}
           from posts p
           left join profiles pr on pr.user_id = p.user_id
           where pr.handle = $2
           order by p.created_at desc, p.id desc
           limit 80`,
          [context.userId, handle],
        )
      : await sql.query<PostRow>(
          `select ${postSelect}
           from posts p
           left join profiles pr on pr.user_id = p.user_id
           order by p.created_at desc, p.id desc
           limit 80`,
          [context.userId],
        );
    return attachMedia(
      sql,
      rows.map((row) => mapPost(row, context.userId)),
    );
  });

export const getPost = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const rows = await sql.query<PostRow>(
      `select ${postSelect}
       from posts p
       left join profiles pr on pr.user_id = p.user_id
       where p.id = $2
       limit 1`,
      [context.userId, data.id],
    );
    const post = rows[0];
    if (!post) throw new Error("Post non trovato.");
    const [mapped] = await attachMedia(sql, [mapPost(post, context.userId)]);
    const commentRows = await sql<{
      id: number;
      user_id: string;
      body: string;
      created_at: unknown;
      handle: string | null;
      display_name: string | null;
      avatar_url: string | null;
    }>`
      select c.id, c.user_id, c.body, c.created_at,
             pr.handle, pr.display_name, pr.avatar_url
      from comments c
      left join profiles pr on pr.user_id = c.user_id
      where c.post_id = ${data.id}
      order by c.created_at asc, c.id asc
    `;
    const comments: CommentDTO[] = commentRows.map((row) => ({
      id: Number(row.id),
      body: row.body,
      createdAt: toIso(row.created_at),
      userId: row.user_id,
      handle: row.handle ?? "utente",
      displayName: row.display_name ?? "Utente",
      avatarUrl: row.avatar_url,
      isOwner: row.user_id === context.userId,
    }));
    return { post: mapped, comments };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(z.object({ handle: z.string().min(1).max(HANDLE_MAX) }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const handle = normalizeHandle(data.handle);
    const rows = await sql<{
      user_id: string;
      handle: string;
      display_name: string;
      avatar_url: string | null;
    }>`
      select user_id, handle, display_name, avatar_url from profiles where handle = ${handle}
    `;
    const row = rows[0];
    if (!row) throw new Error("Profilo non trovato.");
    const counts = await sql<{ n: number | string }>`
      select count(*) as n from posts where user_id = ${row.user_id}
    `;
    const dto: ProfileDTO = {
      handle: row.handle,
      displayName: row.display_name,
      avatarUrl: row.avatar_url,
      postCount: Number(counts[0]?.n) || 0,
      isSelf: row.user_id === context.userId,
    };
    return dto;
  });

const mediaSchema = z.object({
  kind: z.enum(["image", "video"]),
  mime: z.string().min(1).max(80),
  dataB64: z.string().min(1).max(3_600_000),
});

export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      body: z.string().min(1).max(2000),
      gameTag: z.string().max(40).optional(),
      media: z.array(mediaSchema).max(4).optional(),
    }),
  )
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body) throw new Error("Scrivi qualcosa prima di pubblicare.");
    const gameTag = data.gameTag?.trim() ? data.gameTag.trim().slice(0, 40) : null;
    const media = data.media ?? [];
    const hasVideo = media.some((m) => m.kind === "video");
    if (hasVideo && media.length > 1) {
      throw new Error("Un video per post.");
    }
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const inserted = await sql<{ id: number }>`
      insert into posts (user_id, body, game_tag)
      values (${context.userId}, ${body}, ${gameTag})
      returning id
    `;
    const postId = inserted[0]?.id;
    if (!postId) throw new Error("Pubblicazione non riuscita.");
    for (const item of media) {
      await sql`
        insert into post_media (post_id, kind, mime, data_b64)
        values (${postId}, ${item.kind}, ${item.mime}, ${item.dataB64})
      `;
    }
    return { id: Number(postId) };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      delete from posts where id = ${data.id} and user_id = ${context.userId} returning id
    `;
    if (!rows[0]) throw new Error("Non puoi eliminare questo post.");
    return { ok: true as const };
  });

export const toggleLike = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ postId: z.number().int().positive() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const existing = await sql<{ post_id: number }>`
      select post_id from likes where post_id = ${data.postId} and user_id = ${context.userId}
    `;
    if (existing[0]) {
      await sql`delete from likes where post_id = ${data.postId} and user_id = ${context.userId}`;
      return { liked: false };
    }
    const post = await sql<{ id: number }>`select id from posts where id = ${data.postId}`;
    if (!post[0]) throw new Error("Post non trovato.");
    await sql`
      insert into likes (post_id, user_id) values (${data.postId}, ${context.userId})
    `;
    return { liked: true };
  });

export const addComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      postId: z.number().int().positive(),
      body: z.string().min(1).max(800),
    }),
  )
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body) throw new Error("Il commento è vuoto.");
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const post = await sql<{ id: number }>`select id from posts where id = ${data.postId}`;
    if (!post[0]) throw new Error("Post non trovato.");
    const inserted = await sql<{ id: number; created_at: unknown }>`
      insert into comments (post_id, user_id, body)
      values (${data.postId}, ${context.userId}, ${body})
      returning id, created_at
    `;
    const profile = await ensureProfile(sql, context.userId);
    const row = inserted[0];
    const comment: CommentDTO = {
      id: Number(row.id),
      body,
      createdAt: toIso(row.created_at),
      userId: context.userId,
      handle: profile.handle,
      displayName: profile.display_name,
      avatarUrl: profile.avatar_url,
      isOwner: true,
    };
    return comment;
  });

export const deleteComment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<{ id: number }>`
      delete from comments where id = ${data.id} and user_id = ${context.userId} returning id
    `;
    if (!rows[0]) throw new Error("Non puoi eliminare questo commento.");
    return { ok: true as const };
  });
