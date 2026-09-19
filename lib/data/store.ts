import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { seedDatabase } from "@/lib/data/seed";
import type { Database } from "@/lib/data/types";

// A small JSON document store. It fits a single-practice site (a few hundred
// posts and requests) and keeps hosting simple: point DATA_DIR at a persistent
// volume in production. Writes are serialised and atomic (write + rename).

// Runtime-only location: excluded from output file tracing.
export const DATA_DIR = path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR ?? path.join(process.cwd(), ".data"));
export const UPLOADS_DIR = path.join(DATA_DIR, "uploads");
const DB_FILE = path.join(DATA_DIR, "db.json");

let writeQueue: Promise<unknown> = Promise.resolve();

export async function readDatabase(): Promise<Database> {
  try {
    const raw = await readFile(DB_FILE, "utf8");
    const db = JSON.parse(raw) as Database;
    db.users ??= []; // databases created before team accounts existed
    return db;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return seedDatabase();
    throw error;
  }
}

async function persist(db: Database) {
  await mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, JSON.stringify(db, null, 2), "utf8");
  await rename(tmp, DB_FILE);
}

export function mutateDatabase<T>(fn: (db: Database) => T | Promise<T>): Promise<T> {
  const run = writeQueue.then(async () => {
    const db = await readDatabase();
    const result = await fn(db);
    await persist(db);
    return result;
  });
  writeQueue = run.catch(() => undefined);
  return run;
}
