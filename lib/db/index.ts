import "server-only";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

export type Db = PostgresJsDatabase<typeof schema>;
export type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

// One pool per server process, reused across hot reloads in development.
const state = globalThis as unknown as { __amelDb?: Db };

export function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL est manquante : renseignez l’URL de connexion PostgreSQL (voir .env.example).");
  }
  return url;
}

/** The connection opens lazily, on the first query (never during `next build`). */
export function getDb(): Db {
  if (!state.__amelDb) {
    const client = postgres(databaseUrl(), {
      max: Number(process.env.DATABASE_POOL_MAX ?? 10),
      idle_timeout: 30,
      connect_timeout: 10,
      onnotice: () => undefined,
    });
    state.__amelDb = drizzle({ client, schema, casing: "snake_case" });
  }
  return state.__amelDb;
}

/** PostgreSQL error code, when the driver reports one (e.g. 23505 = unique violation). */
export function pgCode(error: unknown): string | undefined {
  let current = error as { code?: unknown; cause?: unknown } | undefined;
  for (let depth = 0; current && depth < 4; depth++) {
    if (typeof current.code === "string" && /^[0-9A-Z]{5}$/.test(current.code)) return current.code;
    current = current.cause as typeof current;
  }
  return undefined;
}
