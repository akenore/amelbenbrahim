// Local PostgreSQL 17 for development, without Docker: `bun run db:local` (Ctrl+C to stop).
// Data lives in .data/postgres. Matching .env.local line:
//   DATABASE_URL=postgres://postgres:postgres@localhost:5433/amelbenbrahim
import { existsSync } from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

const port = Number(process.env.LOCAL_PG_PORT ?? 5433);
const databaseDir = path.resolve(".data/postgres");

const pg = new EmbeddedPostgres({
  databaseDir,
  port,
  user: "postgres",
  password: "postgres",
  authMethod: "scram-sha-256",
  persistent: true,
  onLog: () => undefined,
});

if (!existsSync(path.join(databaseDir, "PG_VERSION"))) await pg.initialise();
await pg.start();
await pg.createDatabase("amelbenbrahim").catch(() => undefined); // already exists

console.log(`PostgreSQL prêt : postgres://postgres:postgres@localhost:${port}/amelbenbrahim`);
console.log("Ctrl+C pour arrêter.");

let stopping = false;
async function stop() {
  if (stopping) return;
  stopping = true;
  await pg.stop();
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
