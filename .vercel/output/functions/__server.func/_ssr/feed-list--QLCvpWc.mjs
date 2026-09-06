import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { f as listPosts, r as Skeleton } from "./app-header-Bh8GcFvU.mjs";
import { t as PostCard } from "./post-card-CLDF0R71.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/feed-list--QLCvpWc.js
var import_jsx_runtime = require_jsx_runtime();
function FeedList({ handle }) {
	const feed = useQuery({
		queryKey: handle ? ["posts", handle] : ["posts"],
		queryFn: () => listPosts(handle ? { data: { handle } } : void 0)
	});
	if (feed.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-72 rounded-2xl" })
		]
	});
	if (feed.isError) {
		const msg = feed.error instanceof Error ? feed.error.message : "Errore";
		if (msg === "Unauthorized") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Accedi per vedere la bacheca."
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-danger",
			children: msg
		});
	}
	const posts = feed.data ?? [];
	if (posts.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-line px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl italic text-fg",
			children: "Ancora silenzio."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "Pubblica il primo screenshot o una clip. La bacheca è di tutti."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostCard, {
			post,
			compact: true
		}, post.id))
	});
}
//#endregion
export { FeedList as t };
