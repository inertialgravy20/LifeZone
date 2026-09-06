import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as Route$2 } from "./router-BhYP6vfS.mjs";
import { d as getProfile, m as useCurrentUserState, n as Avatar, r as Skeleton, t as AppHeader } from "./app-header-Bh8GcFvU.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
import { t as FeedList } from "./feed-list--QLCvpWc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._handle-dTFLjJQt.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { handle } = Route$2.useParams();
	const { user, isPending } = useCurrentUserState();
	const profile = useQuery({
		queryKey: ["profile", handle],
		queryFn: () => getProfile({ data: { handle } }),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-xl px-4 py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-2xl" })
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg pb-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-xl px-4 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-5 inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Bacheca"]
				}),
				profile.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mb-6 h-28 rounded-2xl" }) : profile.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: profile.error instanceof Error ? profile.error.message : "Profilo non trovato."
				}) : profile.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-6 flex items-center gap-4 rounded-2xl border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: profile.data.displayName,
						src: profile.data.avatarUrl,
						size: "lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl italic tracking-tight",
							children: profile.data.displayName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: ["@", profile.data.handle]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs tabular-nums text-subtle",
							children: [
								profile.data.postCount,
								" ",
								profile.data.postCount === 1 ? "post" : "post"
							]
						})
					] })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedList, { handle })
			]
		})]
	});
}
//#endregion
export { ProfilePage as component };
