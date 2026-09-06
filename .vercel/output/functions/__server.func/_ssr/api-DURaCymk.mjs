import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-BjjAItjV.mjs";
import { i as normalizeHandle, t as authMiddleware } from "./handles-BuKFTHau.mjs";
import { cn as _enum, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-DURaCymk.js
function toIso(value) {
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string") {
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? value : d.toISOString();
	}
	return (/* @__PURE__ */ new Date()).toISOString();
}
function mediaUrl(id, publicPath) {
	return publicPath && publicPath.length > 0 ? publicPath : `/api/media/${id}`;
}
async function ensureProfile(sql, userId) {
	const existing = await sql`
    select handle, display_name, avatar_url from profiles where user_id = ${userId}
  `;
	if (existing[0]) return existing[0];
	const users = await sql`
    select "name", "image" from "user" where "id" = ${userId}
  `;
	const name = users[0]?.name?.trim() || "Player";
	const avatar = users[0]?.image ?? null;
	let base = normalizeHandle(name) || "player";
	if (base.length < 3) base = `${base}player`.slice(0, 20);
	for (let i = 0; i < 40; i += 1) {
		const handle = i === 0 ? base : `${base.slice(0, 18)}${i + 1}`.slice(0, 20);
		if ((await sql`
      select handle from profiles where handle = ${handle} limit 1
    `)[0]) continue;
		try {
			await sql`
        insert into profiles (user_id, handle, display_name, avatar_url)
        values (${userId}, ${handle}, ${name.slice(0, 48)}, ${avatar})
      `;
			return {
				handle,
				display_name: name.slice(0, 48),
				avatar_url: avatar
			};
		} catch {
			const again = await sql`
        select handle, display_name, avatar_url from profiles where user_id = ${userId}
      `;
			if (again[0]) return again[0];
		}
	}
	throw new Error("Impossibile creare il profilo.");
}
async function attachMedia(sql, posts) {
	if (posts.length === 0) return posts;
	const ids = posts.map((p) => p.id);
	const placeholders = ids.map((_, i) => `$${i + 1}`).join(", ");
	const rows = await sql.query(`select id, post_id, kind, public_path from post_media where post_id in (${placeholders}) order by id asc`, ids);
	const byPost = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const list = byPost.get(row.post_id) ?? [];
		list.push({
			id: row.id,
			kind: row.kind,
			url: mediaUrl(row.id, row.public_path)
		});
		byPost.set(row.post_id, list);
	}
	return posts.map((p) => ({
		...p,
		media: byPost.get(p.id) ?? []
	}));
}
function mapPost(row, viewerId) {
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
		isOwner: row.user_id === viewerId
	};
}
var postSelect = `
  p.id, p.user_id, p.body, p.game_tag, p.created_at,
  pr.handle, pr.display_name, pr.avatar_url,
  (select count(*) from likes l where l.post_id = p.id) as like_count,
  (select count(*) from comments c where c.post_id = p.id) as comment_count,
  exists(select 1 from likes l where l.post_id = p.id and l.user_id = $1) as liked
`;
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "22a50234c6834efe75f77295bd1caf7f4acbbd2c9125cf8814913c6d6980e0c8",
	name: "getMyProfile",
	filename: "src/lib/api.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const profile = await ensureProfile(sql, context.userId);
	const counts = await sql`
      select count(*) as n from posts where user_id = ${context.userId}
    `;
	return {
		handle: profile.handle,
		displayName: profile.display_name,
		avatarUrl: profile.avatar_url,
		postCount: Number(counts[0]?.n) || 0,
		isSelf: true
	};
});
var claimHandle_createServerFn_handler = createServerRpc({
	id: "5d79ae43b82c4f93366ee871599fd1958ad247551a2b163e64aadd3756a2e639",
	name: "claimHandle",
	filename: "src/lib/api.ts"
}, (opts) => claimHandle.__executeServer(opts));
var claimHandle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ handle: string().min(1).max(40) })).handler(claimHandle_createServerFn_handler, async ({ context, data }) => {
	const handle = normalizeHandle(data.handle);
	if (handle.length < 3) throw new Error(`Il nome utente deve avere almeno 3 caratteri.`);
	const sql = await getSql();
	const taken = await sql`
      select user_id from profiles where handle = ${handle} limit 1
    `;
	if (taken[0] && taken[0].user_id !== context.userId) throw new Error("Questo nome utente è già in uso.");
	const users = await sql`
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
var listPosts_createServerFn_handler = createServerRpc({
	id: "27b0d5360930c88b9d1dfbaaa26983f588b10f6c7b3769142b95a74f10cbb72b",
	name: "listPosts",
	filename: "src/lib/api.ts"
}, (opts) => listPosts.__executeServer(opts));
var listPosts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ handle: string().min(1).max(20).optional() }).optional()).handler(listPosts_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	const handle = data?.handle ? normalizeHandle(data.handle) : null;
	return attachMedia(sql, (handle ? await sql.query(`select ${postSelect}
           from posts p
           left join profiles pr on pr.user_id = p.user_id
           where pr.handle = $2
           order by p.created_at desc, p.id desc
           limit 80`, [context.userId, handle]) : await sql.query(`select ${postSelect}
           from posts p
           left join profiles pr on pr.user_id = p.user_id
           order by p.created_at desc, p.id desc
           limit 80`, [context.userId])).map((row) => mapPost(row, context.userId)));
});
var getPost_createServerFn_handler = createServerRpc({
	id: "9460fe346908a4a261f9bb90213b17927a39123127e285f65714fcd17ad35905",
	name: "getPost",
	filename: "src/lib/api.ts"
}, (opts) => getPost.__executeServer(opts));
var getPost = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: number().int().positive() })).handler(getPost_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	const post = (await sql.query(`select ${postSelect}
       from posts p
       left join profiles pr on pr.user_id = p.user_id
       where p.id = $2
       limit 1`, [context.userId, data.id]))[0];
	if (!post) throw new Error("Post non trovato.");
	const [mapped] = await attachMedia(sql, [mapPost(post, context.userId)]);
	return {
		post: mapped,
		comments: (await sql`
      select c.id, c.user_id, c.body, c.created_at,
             pr.handle, pr.display_name, pr.avatar_url
      from comments c
      left join profiles pr on pr.user_id = c.user_id
      where c.post_id = ${data.id}
      order by c.created_at asc, c.id asc
    `).map((row) => ({
			id: Number(row.id),
			body: row.body,
			createdAt: toIso(row.created_at),
			userId: row.user_id,
			handle: row.handle ?? "utente",
			displayName: row.display_name ?? "Utente",
			avatarUrl: row.avatar_url,
			isOwner: row.user_id === context.userId
		}))
	};
});
var getProfile_createServerFn_handler = createServerRpc({
	id: "b30a4b8f31d8077c4cb918b1b6b037e74fd1555f5b2d488a5c67a260ce8b6f31",
	name: "getProfile",
	filename: "src/lib/api.ts"
}, (opts) => getProfile.__executeServer(opts));
var getProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ handle: string().min(1).max(20) })).handler(getProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	const row = (await sql`
      select user_id, handle, display_name, avatar_url from profiles where handle = ${normalizeHandle(data.handle)}
    `)[0];
	if (!row) throw new Error("Profilo non trovato.");
	const counts = await sql`
      select count(*) as n from posts where user_id = ${row.user_id}
    `;
	return {
		handle: row.handle,
		displayName: row.display_name,
		avatarUrl: row.avatar_url,
		postCount: Number(counts[0]?.n) || 0,
		isSelf: row.user_id === context.userId
	};
});
var mediaSchema = object({
	kind: _enum(["image", "video"]),
	mime: string().min(1).max(80),
	dataB64: string().min(1).max(36e5)
});
var createPost_createServerFn_handler = createServerRpc({
	id: "0e75c3db9c4f996aad888dc206e4a94341123352115bee4c13edd2d4c16f22bf",
	name: "createPost",
	filename: "src/lib/api.ts"
}, (opts) => createPost.__executeServer(opts));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	body: string().min(1).max(2e3),
	gameTag: string().max(40).optional(),
	media: array(mediaSchema).max(4).optional()
})).handler(createPost_createServerFn_handler, async ({ context, data }) => {
	const body = data.body.trim();
	if (!body) throw new Error("Scrivi qualcosa prima di pubblicare.");
	const gameTag = data.gameTag?.trim() ? data.gameTag.trim().slice(0, 40) : null;
	const media = data.media ?? [];
	if (media.some((m) => m.kind === "video") && media.length > 1) throw new Error("Un video per post.");
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	const postId = (await sql`
      insert into posts (user_id, body, game_tag)
      values (${context.userId}, ${body}, ${gameTag})
      returning id
    `)[0]?.id;
	if (!postId) throw new Error("Pubblicazione non riuscita.");
	for (const item of media) await sql`
        insert into post_media (post_id, kind, mime, data_b64)
        values (${postId}, ${item.kind}, ${item.mime}, ${item.dataB64})
      `;
	return { id: Number(postId) };
});
var deletePost_createServerFn_handler = createServerRpc({
	id: "90d231f3d43322e359bb90c1708ede9eadcf8a065ae7f5ce942f7ea72331859c",
	name: "deletePost",
	filename: "src/lib/api.ts"
}, (opts) => deletePost.__executeServer(opts));
var deletePost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int().positive() })).handler(deletePost_createServerFn_handler, async ({ context, data }) => {
	if (!(await (await getSql())`
      delete from posts where id = ${data.id} and user_id = ${context.userId} returning id
    `)[0]) throw new Error("Non puoi eliminare questo post.");
	return { ok: true };
});
var toggleLike_createServerFn_handler = createServerRpc({
	id: "a6f84edd865bbbaa65abf800a22c63158008fde8fe7fcade6b46617587767a29",
	name: "toggleLike",
	filename: "src/lib/api.ts"
}, (opts) => toggleLike.__executeServer(opts));
var toggleLike = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ postId: number().int().positive() })).handler(toggleLike_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	if ((await sql`
      select post_id from likes where post_id = ${data.postId} and user_id = ${context.userId}
    `)[0]) {
		await sql`delete from likes where post_id = ${data.postId} and user_id = ${context.userId}`;
		return { liked: false };
	}
	if (!(await sql`select id from posts where id = ${data.postId}`)[0]) throw new Error("Post non trovato.");
	await sql`
      insert into likes (post_id, user_id) values (${data.postId}, ${context.userId})
    `;
	return { liked: true };
});
var addComment_createServerFn_handler = createServerRpc({
	id: "25b6412aceff27134358c97e01104a602869247612bdb1e0387460ec42dae950",
	name: "addComment",
	filename: "src/lib/api.ts"
}, (opts) => addComment.__executeServer(opts));
var addComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	postId: number().int().positive(),
	body: string().min(1).max(800)
})).handler(addComment_createServerFn_handler, async ({ context, data }) => {
	const body = data.body.trim();
	if (!body) throw new Error("Il commento è vuoto.");
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	if (!(await sql`select id from posts where id = ${data.postId}`)[0]) throw new Error("Post non trovato.");
	const inserted = await sql`
      insert into comments (post_id, user_id, body)
      values (${data.postId}, ${context.userId}, ${body})
      returning id, created_at
    `;
	const profile = await ensureProfile(sql, context.userId);
	const row = inserted[0];
	return {
		id: Number(row.id),
		body,
		createdAt: toIso(row.created_at),
		userId: context.userId,
		handle: profile.handle,
		displayName: profile.display_name,
		avatarUrl: profile.avatar_url,
		isOwner: true
	};
});
var deleteComment_createServerFn_handler = createServerRpc({
	id: "73dcabc3e25261c024de08101ad1e59a6a2e4bc984a1d59d42111934ef14ca4b",
	name: "deleteComment",
	filename: "src/lib/api.ts"
}, (opts) => deleteComment.__executeServer(opts));
var deleteComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int().positive() })).handler(deleteComment_createServerFn_handler, async ({ context, data }) => {
	if (!(await (await getSql())`
      delete from comments where id = ${data.id} and user_id = ${context.userId} returning id
    `)[0]) throw new Error("Non puoi eliminare questo commento.");
	return { ok: true };
});
//#endregion
export { addComment_createServerFn_handler, claimHandle_createServerFn_handler, createPost_createServerFn_handler, deleteComment_createServerFn_handler, deletePost_createServerFn_handler, getMyProfile_createServerFn_handler, getPost_createServerFn_handler, getProfile_createServerFn_handler, listPosts_createServerFn_handler, toggleLike_createServerFn_handler };
