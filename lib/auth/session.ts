import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { can, type Area } from "@/lib/auth/roles";
import { SESSION_COOKIE, SESSION_MAX_AGE, createToken, readToken } from "@/lib/auth/token";
import { readDatabase } from "@/lib/data/store";
import type { AdminUser, TeamMember } from "@/lib/data/types";

export function toTeamMember(user: AdminUser): TeamMember {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active,
    mustChangePassword: user.mustChangePassword,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export async function startSession(user: Pick<AdminUser, "id" | "sessionVersion">) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(user.id, user.sessionVersion), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** The signed-in team member, or null. Cached for the duration of a request. */
export const getCurrentUser = cache(async (): Promise<TeamMember | null> => {
  const store = await cookies();
  const payload = readToken(store.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  const db = await readDatabase();
  const user = db.users.find((u) => u.id === payload.sub);
  if (!user || !user.active || user.sessionVersion !== payload.ver) return null;
  return toTeamMember(user);
});

/**
 * Call at the top of every dashboard page and Server Action.
 * Without `area`, any signed-in member passes.
 */
export async function requireUser(area?: Area): Promise<TeamMember> {
  const user = await getCurrentUser();
  if (!user) redirect("/dashboard/connexion");
  if (area && !can(user.role, area)) redirect("/dashboard?acces=refuse");
  return user;
}
