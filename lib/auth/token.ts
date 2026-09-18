import { createHmac, timingSafeEqual } from "node:crypto";

// Stateless, HMAC-signed session token: base64url(payload).base64url(signature).
// Shared by the proxy (optimistic check) and the server (authoritative check).

export const SESSION_COOKIE = "abb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

type Payload = { sub: "admin"; exp: number };

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

export function createToken(): string {
  const payload: Payload = { sub: "admin", exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${data}.${sign(data)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [data, signature] = token.split(".");
  if (!data || !signature) return false;
  try {
    const expected = Buffer.from(sign(data));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as Payload;
    return payload.sub === "admin" && payload.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}
