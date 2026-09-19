import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { media } from "@/lib/db/schema";

// Serves images uploaded from the dashboard (stored in PostgreSQL, not in /public).
// Names are generated server-side and never reused, so responses are immutable.
export async function GET(_req: Request, ctx: RouteContext<"/media/[file]">) {
  const { file } = await ctx.params;
  if (!/^[a-z0-9-]+\.(webp|jpg|png)$/.test(file)) return new Response("Not found", { status: 404 });
  const [image] = await getDb()
    .select({ mime: media.mime, data: media.data })
    .from(media)
    .where(eq(media.id, file))
    .limit(1);
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mime,
      "Content-Length": String(image.data.byteLength),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": "inline",
    },
  });
}
