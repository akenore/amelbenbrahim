// Runs once when a Next.js server starts, before it accepts requests.
export async function register() {
  // Node.js server only, and never while `next build` prerenders (the database may be unreachable then).
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NEXT_PHASE === "phase-production-build") return;
  const { prepareDatabase } = await import("@/lib/db/setup");
  await prepareDatabase();
}
