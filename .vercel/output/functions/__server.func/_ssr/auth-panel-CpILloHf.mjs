import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { i as normalizeHandle, n as handleHint, r as handleToEmail } from "./handles-BuKFTHau.mjs";
import { r as signIn, t as authClient } from "./client-B40BzJxt.mjs";
import { t as GROK_PROVIDERS } from "./server-CA0Ltlt7.mjs";
import { a as claimHandle } from "./app-header-Bh8GcFvU.mjs";
import { t as Button } from "./button-Bb8JahxT.mjs";
import { t as Input } from "./input-B8nDPIAP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-panel-CpILloHf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPanel({ defaultMode = "login" }) {
	const [mode, setMode] = (0, import_react.useState)(defaultMode);
	const [handle, setHandle] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const hint = handleHint(handle);
	const canSubmit = !hint && password.length >= 6 && !pending && true;
	async function onSubmit(e) {
		e.preventDefault();
		if (!canSubmit) return;
		const clean = normalizeHandle(handle);
		setPending(true);
		setError(null);
		try {
			if (mode === "join") {
				const { error: signErr } = await authClient.signUp.email({
					email: handleToEmail(clean),
					password,
					name: clean
				});
				if (signErr) throw new Error(mapAuthError(signErr.message, "join"));
				await claimHandle({ data: { handle: clean } });
			} else {
				const { error: signErr } = await authClient.signIn.email({
					email: handleToEmail(clean),
					password
				});
				if (signErr) throw new Error(mapAuthError(signErr.message, "login"));
			}
			window.location.href = "/";
		} catch (err) {
			setError(err instanceof Error ? err.message : "Qualcosa è andato storto.");
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full max-w-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex gap-1 rounded-xl bg-raised p-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tabClass(mode === "login"),
					onClick: () => setMode("login"),
					children: "Entra"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: tabClass(mode === "join"),
					onClick: () => setMode("join"),
					children: "Registrati"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "handle",
							className: "mb-1.5 block text-xs font-medium uppercase tracking-wider text-subtle",
							children: "Nome utente"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "handle",
							autoComplete: "username",
							value: handle,
							maxLength: 24,
							onChange: (e) => setHandle(e.target.value),
							placeholder: "es. mara_91"
						}),
						handle && hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs text-danger",
							children: hint
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1.5 text-xs text-subtle",
							children: [
								3,
								"–",
								20,
								" caratteri, lettere e numeri."
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "password",
						className: "mb-1.5 block text-xs font-medium uppercase tracking-wider text-subtle",
						children: "Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "password",
						type: "password",
						autoComplete: mode === "join" ? "new-password" : "current-password",
						value: password,
						onChange: (e) => setPassword(e.target.value),
						placeholder: "Almeno 6 caratteri"
					})] }),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "w-full",
						size: "lg",
						disabled: !canSubmit,
						children: pending ? "Attendi…" : mode === "join" ? "Crea account" : "Entra"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" }),
					"oppure",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-line" })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2",
				children: GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "w-full",
					onClick: () => signIn(p.providerId, { callbackURL: "/" }),
					children: ["Continua con ", p.label]
				}, p.providerId))
			})] })
		]
	});
}
function tabClass(active) {
	return ["h-10 flex-1 rounded-lg text-sm font-medium transition-colors duration-150", active ? "bg-surface text-fg shadow-soft" : "text-muted hover:text-fg"].join(" ");
}
function mapAuthError(message, mode) {
	const m = (message ?? "").toLowerCase();
	if (m.includes("invalid") || m.includes("credential")) return mode === "login" ? "Nome utente o password non corretti." : "Dati non validi.";
	if (m.includes("exist") || m.includes("already")) return "Questo nome utente è già registrato.";
	if (m.includes("password")) return "Password troppo corta.";
	return message || "Accesso non riuscito.";
}
//#endregion
export { AuthPanel as t };
