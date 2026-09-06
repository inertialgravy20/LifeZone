import { o as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, i as useQueryClient, o as require_react, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { o as LoaderCircle, s as ImagePlus, t as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as createPost } from "./app-header-Bh8GcFvU.mjs";
import { t as Button } from "./button-Bb8JahxT.mjs";
import { t as Input } from "./input-B8nDPIAP.mjs";
import { t as Textarea } from "./textarea-C-GC10sT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/composer-Itx0Cb2Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAX_FILES = 4;
var MAX_IMAGE_EDGE = 1080;
var JPEG_QUALITY = .74;
var MAX_VIDEO_BYTES = 24e5;
var MAX_VIDEO_SECONDS = 20;
function mediaLimitLabel() {
	return "Fino a 4 immagini, oppure 1 video (max 20s / 2,4 MB).";
}
async function prepareFiles(files) {
	if (files.length === 0) return [];
	const list = files.slice(0, MAX_FILES);
	if (list.some((f) => f.type.startsWith("video/")) && list.length > 1) throw new Error("Un video per post, senza altre immagini.");
	const out = [];
	for (const file of list) if (file.type.startsWith("image/")) out.push(await compressImage(file));
	else if (file.type.startsWith("video/")) out.push(await readVideo(file));
	else throw new Error("Formato non supportato. Usa immagini o video.");
	return out;
}
async function compressImage(file) {
	const bitmap = await loadImage(file);
	const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
	const width = Math.max(1, Math.round(bitmap.width * scale));
	const height = Math.max(1, Math.round(bitmap.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Impossibile preparare l'immagine.");
	ctx.drawImage(bitmap, 0, 0, width, height);
	if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();
	return {
		kind: "image",
		mime: "image/jpeg",
		dataB64: stripDataUrl(canvas.toDataURL("image/jpeg", JPEG_QUALITY))
	};
}
function loadImage(file) {
	if (typeof createImageBitmap === "function") return createImageBitmap(file);
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(url);
			resolve(img);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Immagine non valida."));
		};
		img.src = url;
	});
}
async function readVideo(file) {
	if (file.size > MAX_VIDEO_BYTES) throw new Error("Video troppo pesante. Max 2,4 MB.");
	if (await videoDuration(file) > MAX_VIDEO_SECONDS) throw new Error("Video troppo lungo. Max 20 secondi.");
	const dataUrl = await fileToDataUrl(file);
	return {
		kind: "video",
		mime: file.type || "video/mp4",
		dataB64: stripDataUrl(dataUrl)
	};
}
function videoDuration(file) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const video = document.createElement("video");
		video.preload = "metadata";
		video.onloadedmetadata = () => {
			const d = video.duration;
			URL.revokeObjectURL(url);
			resolve(Number.isFinite(d) ? d : 0);
		};
		video.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Video non valido."));
		};
		video.src = url;
	});
}
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Lettura file non riuscita."));
		reader.readAsDataURL(file);
	});
}
function stripDataUrl(dataUrl) {
	const idx = dataUrl.indexOf("base64,");
	return idx >= 0 ? dataUrl.slice(idx + 7) : dataUrl;
}
var GENRES = [
	"Souls-like",
	"RPG",
	"FPS",
	"Racing",
	"Indie",
	"Esplorazione",
	"Avventura",
	"Strategia",
	"Horror",
	"Sport"
];
function Composer({ onPublished, autofocus = false }) {
	const queryClient = useQueryClient();
	const fileRef = (0, import_react.useRef)(null);
	const [body, setBody] = (0, import_react.useState)("");
	const [gameTag, setGameTag] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	const [previews, setPreviews] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const mutation = useMutation({
		mutationFn: (payload) => createPost({ data: payload }),
		onSuccess: (res) => {
			toast("Post pubblicato");
			setBody("");
			setGameTag("");
			clearFiles();
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			queryClient.invalidateQueries({ queryKey: ["me"] });
			onPublished?.(res.id);
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Pubblicazione non riuscita");
		}
	});
	function clearFiles() {
		previews.forEach((p) => URL.revokeObjectURL(p.url));
		setPreviews([]);
		setFiles([]);
		if (fileRef.current) fileRef.current.value = "";
	}
	function onPick(list) {
		if (!list || list.length === 0) return;
		const next = Array.from(list).slice(0, 4);
		previews.forEach((p) => URL.revokeObjectURL(p.url));
		setFiles(next);
		setPreviews(next.map((f) => ({
			url: URL.createObjectURL(f),
			kind: f.type.startsWith("video/") ? "video" : "image",
			name: f.name
		})));
	}
	async function onSubmit(e) {
		e.preventDefault();
		if (!body.trim() || busy || mutation.isPending) return;
		setBusy(true);
		try {
			const media = await prepareFiles(files);
			await mutation.mutateAsync({
				body: body.trim(),
				gameTag: gameTag.trim() || void 0,
				media
			});
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "File non validi");
		} finally {
			setBusy(false);
		}
	}
	const pending = busy || mutation.isPending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "sr-only",
				htmlFor: "post-body",
				children: "Testo del post"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "post-body",
				value: body,
				onChange: (e) => setBody(e.target.value),
				maxLength: 2e3,
				autoFocus: autofocus,
				placeholder: "Cosa stai giocando? Una clip, uno screenshot, un’opinione.",
				className: "min-h-28 border-transparent bg-transparent px-0 py-0 placeholder:text-muted focus:ring-0"
			}),
			previews.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4",
				children: previews.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "relative overflow-hidden rounded-lg bg-raised",
					children: p.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: p.url,
						className: "aspect-square w-full object-cover",
						muted: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.url,
						alt: "",
						className: "aspect-square w-full object-cover"
					})
				}, p.url))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-3 sm:flex-row sm:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "game-tag",
							className: "mb-1.5 block text-xs font-medium uppercase tracking-wider text-subtle",
							children: "Gioco (opzionale)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "game-tag",
							list: "genre-list",
							value: gameTag,
							maxLength: 40,
							onChange: (e) => setGameTag(e.target.value),
							placeholder: "Souls-like, Racing…"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("datalist", {
							id: "genre-list",
							children: GENRES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: g }, g))
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "post-files",
							ref: fileRef,
							type: "file",
							accept: "image/*,video/*",
							multiple: true,
							className: "sr-only",
							onChange: (e) => onPick(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							"aria-label": "Allega immagini o video",
							onClick: () => fileRef.current?.click(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
								className: "size-5",
								strokeWidth: 1.75
							})
						}),
						previews.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							"aria-label": "Rimuovi allegati",
							onClick: clearFiles,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: !body.trim() || pending,
							className: "min-w-28",
							children: pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : "Pubblica"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-subtle",
				children: mediaLimitLabel()
			})
		]
	});
}
//#endregion
export { Composer as t };
