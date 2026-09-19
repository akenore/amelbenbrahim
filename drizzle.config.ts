import { defineConfig } from "drizzle-kit";

// `bun run db:generate` writes a new SQL migration to ./drizzle after a schema change.
// Migrations are applied automatically when the server starts (instrumentation.ts).
export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
