import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as ArrowLeft } from "../_libs/lucide-react.mjs";
import { m as useCurrentUserState, r as Skeleton, t as AppHeader } from "./app-header-Bh8GcFvU.mjs";
import { t as Composer } from "./composer-Itx0Cb2Z.mjs";
import { t as RedirectToSignIn } from "./gates-CUxTjxua.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-D1TRNwKK.js
var import_jsx_runtime = require_jsx_runtime();
function NewPost() {
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-xl px-4 py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-2xl" })
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-xl px-4 py-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-5 inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Bacheca"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-4 font-display text-3xl italic tracking-tight",
					children: "Nuovo post"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
					autofocus: true,
					onPublished: (id) => {
						navigate({
							to: "/p/$postId",
							params: { postId: String(id) }
						});
					}
				})
			]
		})]
	});
}
//#endregion
export { NewPost as component };
