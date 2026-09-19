// Recovery tool: create an administrator or reset an existing account's password.
// Usage (on the server, in the app container, or locally with DATABASE_URL set):
//   bun scripts/create-admin.mjs <email> "<Nom affiché>" [mot-de-passe]
// Without a password, a temporary one is generated and printed.
import { randomBytes, randomInt, scryptSync } from "node:crypto";
import postgres from "postgres";

try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local (production: variables come from the environment).
}

const [emailArg, nameArg, passwordArg] = process.argv.slice(2);
if (!emailArg || !emailArg.includes("@")) {
  console.error('Usage: bun scripts/create-admin.mjs <email> "<Nom affiché>" [mot-de-passe]');
  process.exit(1);
}
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL est manquante.");
  process.exit(1);
}

const email = emailArg.trim().toLowerCase();
const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const password = passwordArg ?? Array.from({ length: 14 }, () => alphabet[randomInt(alphabet.length)]).join("");
if (password.length < 10) {
  console.error("Le mot de passe doit contenir au moins 10 caractères.");
  process.exit(1);
}

// Same format as lib/auth/password.ts
const salt = randomBytes(16);
const hash = scryptSync(password.normalize("NFKC"), salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
const passwordHash = `scrypt$16384$8$1$${salt.toString("base64url")}$${hash.toString("base64url")}`;

const sql = postgres(process.env.DATABASE_URL, { max: 1, onnotice: () => undefined });
try {
  const [row] = await sql`
    insert into users (name, email, role, password_hash, active, must_change_password)
    values (${nameArg || email}, ${email}, 'admin', ${passwordHash}, true, ${!passwordArg})
    on conflict (email) do update set
      password_hash = excluded.password_hash,
      role = 'admin',
      active = true,
      must_change_password = excluded.must_change_password,
      session_version = users.session_version + 1,
      name = coalesce(${nameArg ?? null}, users.name)
    returning (xmax = 0) as created`;
  console.log(`${row.created ? "Administrateur créé" : "Compte réinitialisé"} : ${email}`);
  if (!passwordArg) console.log(`Mot de passe temporaire : ${password}`);
} catch (error) {
  if (error.code === "42P01") console.error("Tables absentes : démarrez le site une première fois pour créer la base.");
  else console.error(error.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
