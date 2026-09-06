import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as Route$3 } from "./router-BhYP6vfS.mjs";
import { c as deleteComment, i as addComment, m as useCurrentUserState, n as Avatar, r as Skeleton, t as AppHeader, u as getPost } from "./app-header-Bh8GcFvU.mjs";
import { t as Button } from "./button-Bb8JahxT.mjs";
import { t as Textarea } from "./textarea-C-GC10sT.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { n as formatRelative, t as PostCard } from "./post-card-CLDF0R71.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/p._postId-CpXz_8dx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommentThread({ postId, comments }) {
	const queryClient = useQueryClient();
	const [body, setBody] = (0, import_react.useState)("");
	const addMut = useMutation({
		mutationFn: () => addComment({ data: {
			postId,
			body: body.trim()
		} }),
		onSuccess: () => {
			setBody("");
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Commento non inviato")
	});
	const delMut = useMutation({
		mutationFn: (id) => deleteComment({ data: { id } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["post", postId] });
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
		onError: (err) => toast.error(err instanceof Error ? err.message : "Eliminazione non riuscita")
	});
	function onSubmit(e) {
		e.preventDefault();
		if (!body.trim() || addMut.isPending) return;
		addMut.mutate();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
				className: "font-display text-lg italic text-fg",
				children: [
					"Commenti",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-sans text-sm not-italic text-subtle tabular-nums",
						children: comments.length
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-4",
				children: comments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm text-muted",
					children: "Nessun commento. Apri la conversazione."
				}) : comments.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/u/$handle",
						params: { handle: c.handle },
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							name: c.displayName,
							src: c.avatarUrl,
							size: "sm"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 rounded-xl bg-raised px-3 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/u/$handle",
									params: { handle: c.handle },
									className: "truncate text-sm font-medium text-fg hover:underline",
									children: c.displayName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									className: "text-xs text-subtle tabular-nums",
									children: formatRelative(c.createdAt)
								}),
								c.isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ml-auto text-xs text-subtle hover:text-danger",
									onClick: () => delMut.mutate(c.id),
									children: "Elimina"
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 whitespace-pre-wrap text-sm leading-relaxed text-fg",
							children: c.body
						})]
					})]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-5 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "comment-body",
						className: "sr-only",
						children: "Nuovo commento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "comment-body",
						value: body,
						maxLength: 800,
						onChange: (e) => setBody(e.target.value),
						placeholder: "Scrivi un commento…",
						className: "min-h-24"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: !body.trim() || addMut.isPending,
							children: addMut.isPending ? "Invio…" : "Commenta"
						})
					})
				]
			})
		]
	});
}
function PostPage() {
	const { postId } = Route$3.useParams();
	const id = Number(postId);
	const { user, isPending } = useCurrentUserState();
	const query = useQuery({
		queryKey: ["post", id],
		queryFn: () => getPost({ data: { id } }),
		enabled: Boolean(user) && Number.isFinite(id)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-xl px-4 py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 rounded-2xl" })
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-xl px-4 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mb-5 inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Bacheca"]
			}), query.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-80 rounded-2xl" }) : query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-danger",
				children: query.error instanceof Error ? query.error.message : "Post non trovato."
			}) : query.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, { post: query.data.post }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentThread, {
				postId: id,
				comments: query.data.comments
			})] }) : null]
		})]
	});
}
//#endregion
export { PostPage as component };
