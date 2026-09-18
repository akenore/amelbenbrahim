import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOADS_DIR } from "@/lib/data/store";

const types: Record<string, string> = { ".webp": "image/webp", ".jpg": "image/jpeg", ".png": "image/png" };

// Serves images uploaded from the dashboard (files added at runtime are not
// served from /public). Names are generated server-side and never reused.
export async function GET(_req: Request, ctx: RouteContext<"/media/[file]">) {
  const { file } = await ctx.params;
  if (!/^[a-z0-9-]+\.(webp|jpg|png)$/.test(file)) return new Response("Not found", { status: 404 });
  try {
    const data = await readFile(path.join(UPLOADS_DIR, file));
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": types[path.extname(file)],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
