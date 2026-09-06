import { a as require_jsx_runtime, i as useQueryClient, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as MessageCircle, c as Heart, r as Trash2 } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { l as deletePost, n as Avatar, o as cn, p as toggleLike } from "./app-header-Bh8GcFvU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/post-card-CLDF0R71.js
var import_jsx_runtime = require_jsx_runtime();
function formatRelative(value) {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const seconds = Math.round((Date.now() - date.getTime()) / 1e3);
	if (seconds < 45) return "adesso";
	if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))} min`;
	if (seconds < 86400) return `${Math.max(1, Math.round(seconds / 3600))} h`;
	if (seconds < 604800) return `${Math.max(1, Math.round(seconds / 86400))} g`;
	return date.toLocaleDateString("it-IT", {
		day: "numeric",
		month: "short"
	});
}
function PostCard({ post, compact = false }) {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const likeMut = useMutation({
		mutationFn: () => toggleLike({ data: { postId: post.id } }),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["posts"] });
			const previous = queryClient.getQueriesData({ queryKey: ["posts"] });
			queryClient.setQueriesData({ queryKey: ["posts"] }, (old) => patchPosts(old, post.id, (p) => ({
				...p,
				liked: !p.liked,
				likeCount: p.likeCount + (p.liked ? -1 : 1)
			})));
			queryClient.setQueryData(["post", post.id], (old) => {
				if (!old || typeof old !== "object" || !("post" in old)) return old;
				const rec = old;
				return {
					...rec,
					post: {
						...rec.post,
						liked: !rec.post.liked,
						likeCount: rec.post.likeCount + (rec.post.liked ? -1 : 1)
					}
				};
			});
			return { previous };
		},
		onError: (err, _v, ctx) => {
			ctx?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
			toast.error(err instanceof Error ? err.message : "Like non riuscito");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["post", post.id] });
		}
	});
	const delMut = useMutation({
		mutationFn: () => deletePost({ data: { id: post.id } }),
		onSuccess: () => {
			toast("Post eliminato");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["me"] });
			if (!compact) navigate({ to: "/" });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Eliminazione non riuscita")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/u/$handle",
					params: { handle: post.handle },
					className: "shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: post.displayName,
						src: post.avatarUrl
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/u/$handle",
									params: { handle: post.handle },
									className: "truncate font-medium text-fg hover:underline",
									children: post.displayName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "truncate text-sm text-subtle",
									children: ["@", post.handle]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									className: "ml-auto shrink-0 text-xs tabular-nums text-subtle",
									dateTime: post.createdAt,
									title: post.createdAt,
									children: formatRelative(post.createdAt)
								})
							]
						}),
						post.gameTag ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex rounded-full border border-line px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider text-muted",
								children: post.gameTag
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-fg",
							children: post.body
						})
					]
				})]
			}),
			post.media.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mt-4 overflow-hidden rounded-xl bg-raised", post.media.length > 1 && "grid grid-cols-2 gap-1"),
				children: post.media.map((m) => m.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
					src: m.url,
					controls: true,
					playsInline: true,
					preload: "metadata",
					className: "max-h-[480px] w-full bg-bg object-contain"
				}, m.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: m.url,
					alt: "",
					className: cn("w-full object-cover", post.media.length === 1 ? "max-h-[520px] object-contain bg-bg" : "aspect-square")
				}, m.id))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						"aria-pressed": post.liked,
						"aria-label": post.liked ? "Togli mi piace" : "Metti mi piace",
						onClick: () => likeMut.mutate(),
						className: cn("inline-flex h-11 min-w-11 items-center gap-1.5 rounded-lg px-2.5 text-sm transition-[color,background-color] duration-150", post.liked ? "text-like" : "text-muted hover:bg-raised hover:text-fg"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative size-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", post.liked ? "scale-100 opacity-100 blur-none" : "scale-[0.25] opacity-0 blur-[4px]"),
								fill: "currentColor",
								strokeWidth: 1.75
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {
								className: cn("absolute inset-0 size-5 transition-[opacity,transform,filter] duration-300 ease-[cubic-bezier(0.2,0,0,1)]", post.liked ? "scale-[0.25] opacity-0 blur-[4px]" : "scale-100 opacity-100 blur-none"),
								strokeWidth: 1.75
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: post.likeCount
						})]
					}),
					compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/p/$postId",
						params: { postId: String(post.id) },
						className: "inline-flex h-11 min-w-11 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted transition-colors duration-150 hover:bg-raised hover:text-fg",
						"aria-label": "Commenta",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
							className: "size-5",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: post.commentCount
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex h-11 items-center gap-1.5 px-2.5 text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, {
							className: "size-5",
							strokeWidth: 1.75
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: post.commentCount
						})]
					}),
					post.isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "ml-auto inline-flex h-11 min-w-11 items-center justify-center rounded-lg text-subtle transition-colors duration-150 hover:bg-danger/10 hover:text-danger",
						"aria-label": "Elimina post",
						disabled: delMut.isPending,
						onClick: () => {
							if (window.confirm("Eliminare questo post?")) delMut.mutate();
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
							className: "size-4",
							strokeWidth: 1.75
						})
					}) : compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/p/$postId",
						params: { postId: String(post.id) },
						className: "ml-auto text-xs text-subtle hover:text-muted",
						children: "Apri"
					}) : null
				]
			})
		]
	});
}
function patchPosts(old, id, fn) {
	if (!Array.isArray(old)) return old;
	return old.map((p) => p && typeof p === "object" && "id" in p && p.id === id ? fn(p) : p);
}
//#endregion
export { formatRelative as n, PostCard as t };
