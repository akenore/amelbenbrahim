import { createHmac, timingSafeEqual } from "node:crypto";

// Stateless, HMAC-signed session token: base64url(payload).base64url(signature).
// The proxy only checks signature and expiry (optimistic); the server also checks
// that the user still exists, is active and that `ver` matches, so changing a
// password or deactivating an account revokes existing sessions.

export const SESSION_COOKIE = "abb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { sub: string; ver: number; exp: number };

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters.");
  }
  return secret;
}

function sign(data: string) {
  return createHmac("sha256", getSecret()).update(data).digest("base64url");
}

export function createToken(userId: string, version: number): string {
  const payload: SessionPayload = { sub: userId, ver: version, exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function readToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  const [data, signature] = token.split(".");
  if (!data || !signature) return null;
  try {
    const expected = Buffer.from(sign(data));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as SessionPayload;
    if (typeof payload.sub !== "string" || typeof payload.ver !== "number") return null;
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}
