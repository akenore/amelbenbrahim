// Recovery tool: create an administrator or reset an existing account's password.
// Usage (on the server, from the project folder):
//   node scripts/create-admin.mjs <email> "<Nom affiché>" [mot-de-passe]
// Without a password, a temporary one is generated and printed.
import { randomBytes, randomInt, randomUUID, scryptSync } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";

const [emailArg, nameArg, passwordArg] = process.argv.slice(2);
if (!emailArg || !emailArg.includes("@")) {
  console.error('Usage: node scripts/create-admin.mjs <email> "<Nom affiché>" [mot-de-passe]');
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

const dataDir = path.resolve(process.env.DATA_DIR ?? path.join(process.cwd(), ".data"));
const file = path.join(dataDir, "db.json");
let db;
try {
  db = JSON.parse(readFileSync(file, "utf8"));
} catch {
  console.error(`Base introuvable (${file}). Lancez le site une première fois ou vérifiez DATA_DIR.`);
  process.exit(1);
}
db.users ??= [];

const existing = db.users.find((u) => u.email === email);
if (existing) {
  existing.passwordHash = passwordHash;
  existing.role = "admin";
  existing.active = true;
  existing.mustChangePassword = !passwordArg;
  existing.sessionVersion = (existing.sessionVersion ?? 0) + 1;
  if (nameArg) existing.name = nameArg;
} else {
  db.users.push({
    id: randomUUID(),
    name: nameArg || email,
    email,
    role: "admin",
    passwordHash,
    active: true,
    sessionVersion: 1,
    mustChangePassword: !passwordArg,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  });
}

mkdirSync(dataDir, { recursive: true });
const tmp = `${file}.${process.pid}.tmp`;
writeFileSync(tmp, JSON.stringify(db, null, 2));
renameSync(tmp, file);
console.log(`${existing ? "Compte réinitialisé" : "Administrateur créé"} : ${email}`);
if (!passwordArg) console.log(`Mot de passe temporaire : ${password}`);
