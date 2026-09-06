import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as PenLine } from "../_libs/lucide-react.mjs";
import { m as useCurrentUserState, r as Skeleton, t as AppHeader } from "./app-header-Bh8GcFvU.mjs";
import { t as AuthPanel } from "./auth-panel-CpILloHf.mjs";
import { t as Composer } from "./composer-Itx0Cb2Z.mjs";
import { t as FeedList } from "./feed-list--QLCvpWc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BE9q-coi.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-xl px-4 py-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mb-4 h-40 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-2xl" })]
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landing, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, { solid: true }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-xl px-4 py-6 sm:px-0 sm:py-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl italic tracking-tight text-fg",
							children: "Bacheca"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: "Screenshot, clip e opinioni. Tutto in un unico posto."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-6 hidden sm:block",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedList, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/new",
				"aria-label": "Nuovo post",
				className: "fixed bottom-5 right-5 z-20 inline-flex size-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-soft transition-transform duration-150 active:scale-[0.96] sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, {
					className: "size-6",
					strokeWidth: 1.75
				})
			})
		]
	});
}
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "grid min-h-dvh lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col justify-center px-5 py-24 sm:px-10 lg:px-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.22em] text-subtle",
						children: "Community di giocatori"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 max-w-md font-display text-4xl italic leading-tight tracking-tight text-fg sm:text-5xl",
						children: "La bacheca dove restano le partite."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-sm text-base leading-relaxed text-muted",
						children: "Entra con un nome utente, pubblica screenshot e clip, leggi tutti gli altri. Like e commenti, senza rumore."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthPanel, {})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative hidden min-h-dvh lg:block",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/seed/citadel.jpg",
						alt: "",
						className: "absolute inset-0 h-full w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-bg via-bg/30 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute bottom-8 left-8 right-8 font-display text-lg italic text-fg",
						children: "Un posto solo. Tutti i replay."
					})
				]
			})]
		})]
	});
}
//#endregion
export { Home as component };
