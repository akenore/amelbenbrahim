import "server-only";
import { randomBytes, randomInt, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// Format: scrypt$N$r$p$salt$hash (base64url). Parameters are stored with the
// hash so they can be raised later without invalidating existing passwords.
const PARAMS = { N: 16384, r: 8, p: 1 };
const KEYLEN = 64;

function derive(password: string, salt: Buffer, opts: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEYLEN, { ...opts, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, PARAMS);
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, N, r, p, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await derive(password, Buffer.from(salt, "base64url"), { N: Number(N), r: Number(r), p: Number(p) });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

// Used when the e-mail is unknown, so a failed login always costs one derivation.
const DUMMY_HASH = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);
export async function burnPasswordCheck(password: string) {
  await verifyPassword(password, DUMMY_HASH).catch(() => false);
}

/** Readable temporary password (no ambiguous characters). */
export function generatePassword(length = 14) {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => alphabet[randomInt(alphabet.length)]).join("");
}

export { PASSWORD_MIN } from "@/lib/auth/policy";
