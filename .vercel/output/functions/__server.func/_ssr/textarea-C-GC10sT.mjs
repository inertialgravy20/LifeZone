import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { o as cn } from "./app-header-Bh8GcFvU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/textarea-C-GC10sT.js
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-28 w-full resize-y rounded-lg border border-line bg-raised px-3.5 py-3 text-sm leading-relaxed text-fg placeholder:text-subtle", "transition-[border-color,box-shadow] duration-150 ease-out", "focus:border-line-strong focus:outline-none focus:ring-2 focus:ring-accent/35", className),
		...props
	});
}
//#endregion
export { Textarea as t };
