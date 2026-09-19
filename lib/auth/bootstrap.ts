import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

/**
 * First-run access from ADMIN_EMAIL / ADMIN_PASSWORD. Only consulted while the
 * team has no account yet; the first login turns it into a real administrator.
 */
export function checkBootstrapCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return false;
  const emailOk = timingSafeEqual(digest(email), digest(adminEmail));
  const passwordOk = timingSafeEqual(digest(password), digest(adminPassword));
  return emailOk && passwordOk;
}
