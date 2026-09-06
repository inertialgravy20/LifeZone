import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const raw = url.pathname.split("/").pop() ?? "";
        const id = Number(raw);
        if (!Number.isFinite(id) || id <= 0) {
          return new Response("Not found", { status: 404 });
        }
        const sql = await getSql();
        const rows = await sql<{
          mime: string;
          data_b64: string | null;
          public_path: string | null;
        }>`
          select mime, data_b64, public_path from post_media where id = ${id}
        `;
        const row = rows[0];
        if (!row) return new Response("Not found", { status: 404 });
        if (row.public_path) {
          return Response.redirect(new URL(row.public_path, url.origin), 302);
        }
        if (!row.data_b64) return new Response("Not found", { status: 404 });
        const buf = Buffer.from(row.data_b64, "base64");
        return new Response(buf, {
          status: 200,
          headers: {
            "Content-Type": row.mime || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
