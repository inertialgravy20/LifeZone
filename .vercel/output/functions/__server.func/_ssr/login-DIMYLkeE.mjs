import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as useCurrentUserState, r as Skeleton, t as AppHeader } from "./app-header-Bh8GcFvU.mjs";
import { t as AuthPanel } from "./auth-panel-CpILloHf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DIMYLkeE.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-dvh place-items-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full max-w-sm rounded-2xl" })
	});
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-5 py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl italic tracking-tight text-fg",
					children: "Entra in Replay"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 mb-8 text-sm text-muted",
					children: "Un nome utente, e sei nella bacheca."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPanel, {})
			]
		})]
	});
}
//#endregion
export { Login as component };
