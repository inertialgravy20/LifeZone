import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, n as useQuery, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./handles-BuKFTHau.mjs";
import { cn as _enum, gn as object, hn as number, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { i as signOut, t as authClient } from "./client-B40BzJxt.mjs";
import { a as hasGateSessionMarker } from "./server-CA0Ltlt7.mjs";
import { l as ChevronDown } from "../_libs/lucide-react.mjs";
import { i as createSsrRpc } from "./router-BhYP6vfS.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-header-Bh8GcFvU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Avatar({ name, src, size = "md" }) {
	const letter = (name.trim().charAt(0) || "?").toUpperCase();
	const dim = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-14 text-lg" : "size-10 text-sm";
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: cn("shrink-0 rounded-full object-cover", dim)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("grid shrink-0 place-items-center rounded-full bg-raised font-medium text-accent", dim),
		children: letter
	});
}
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("22a50234c6834efe75f77295bd1caf7f4acbbd2c9125cf8814913c6d6980e0c8"));
var claimHandle = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ handle: string().min(1).max(40) })).handler(createSsrRpc("5d79ae43b82c4f93366ee871599fd1958ad247551a2b163e64aadd3756a2e639"));
var listPosts = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ handle: string().min(1).max(20).optional() }).optional()).handler(createSsrRpc("27b0d5360930c88b9d1dfbaaa26983f588b10f6c7b3769142b95a74f10cbb72b"));
var getPost = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ id: number().int().positive() })).handler(createSsrRpc("9460fe346908a4a261f9bb90213b17927a39123127e285f65714fcd17ad35905"));
var getProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator(object({ handle: string().min(1).max(20) })).handler(createSsrRpc("b30a4b8f31d8077c4cb918b1b6b037e74fd1555f5b2d488a5c67a260ce8b6f31"));
var mediaSchema = object({
	kind: _enum(["image", "video"]),
	mime: string().min(1).max(80),
	dataB64: string().min(1).max(36e5)
});
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	body: string().min(1).max(2e3),
	gameTag: string().max(40).optional(),
	media: array(mediaSchema).max(4).optional()
})).handler(createSsrRpc("0e75c3db9c4f996aad888dc206e4a94341123352115bee4c13edd2d4c16f22bf"));
var deletePost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int().positive() })).handler(createSsrRpc("90d231f3d43322e359bb90c1708ede9eadcf8a065ae7f5ce942f7ea72331859c"));
var toggleLike = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ postId: number().int().positive() })).handler(createSsrRpc("a6f84edd865bbbaa65abf800a22c63158008fde8fe7fcade6b46617587767a29"));
var addComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	postId: number().int().positive(),
	body: string().min(1).max(800)
})).handler(createSsrRpc("25b6412aceff27134358c97e01104a602869247612bdb1e0387460ec42dae950"));
var deleteComment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ id: number().int().positive() })).handler(createSsrRpc("73dcabc3e25261c024de08101ad1e59a6a2e4bc984a1d59d42111934ef14ca4b"));
var subscribeToNothing = () => () => {};
var noGateOnServer = () => false;
function AccountMenu() {
	const user = useCurrentUser();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateOnServer);
	const profile = useQuery({
		queryKey: ["me"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	if (!user) return null;
	const handle = profile.data?.handle;
	const name = profile.data?.displayName ?? user.displayName ?? "Account";
	const avatar = profile.data?.avatarUrl ?? user.profileImageUrl;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "flex h-11 items-center gap-2 rounded-xl border border-line bg-surface pl-1.5 pr-3 transition-[background-color,border-color] duration-150 hover:bg-raised",
			onClick: () => setOpen((v) => !v),
			"aria-expanded": open,
			"aria-haspopup": "menu",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name,
					src: avatar,
					size: "sm"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden max-w-28 truncate text-sm font-medium sm:inline",
					children: handle ? `@${handle}` : name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-muted transition-transform duration-150", open && "rotate-180") })
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "fixed inset-0 z-40 cursor-default",
			"aria-label": "Chiudi menu",
			onClick: () => setOpen(false)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "menu",
			className: "absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-line bg-surface p-1.5 shadow-soft",
			children: [handle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/u/$handle",
				params: { handle },
				className: "block rounded-md px-3 py-2.5 text-sm text-fg hover:bg-raised",
				onClick: () => setOpen(false),
				children: "Il tuo profilo"
			}) : null, !gateSession ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				role: "menuitem",
				disabled: signingOut,
				className: "block w-full rounded-md px-3 py-2.5 text-left text-sm text-muted hover:bg-raised hover:text-fg disabled:opacity-50",
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				children: signingOut ? "Uscita…" : "Esci"
			}) : null]
		})] }) : null]
	});
}
function Skeleton({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-raised", className),
		"aria-hidden": "true"
	});
}
function AppHeader({ solid = false }) {
	const { user, isPending } = useCurrentUserState();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: solid ? "sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md" : "absolute inset-x-0 top-0 z-30",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-baseline gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-2xl italic tracking-tight text-fg",
					children: "Replay"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "hidden text-xs uppercase tracking-[0.18em] text-subtle sm:inline",
					children: "bacheca"
				})]
			}), isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-11 w-28 rounded-xl" }) : user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountMenu, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "inline-flex h-11 items-center rounded-lg border border-line-strong px-4 text-sm font-medium text-fg transition-colors duration-150 hover:bg-raised",
				children: "Entra"
			})]
		})
	});
}
//#endregion
export { claimHandle as a, deleteComment as c, getProfile as d, listPosts as f, addComment as i, deletePost as l, useCurrentUserState as m, Avatar as n, cn as o, toggleLike as p, Skeleton as r, createPost as s, AppHeader as t, getPost as u };
