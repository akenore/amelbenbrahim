"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PASSWORD_MIN, generatePassword, hashPassword, verifyPassword } from "@/lib/auth/password";
import { roles, type Role } from "@/lib/auth/roles";
import { requireUser, startSession } from "@/lib/auth/session";
import { mutateDatabase } from "@/lib/data/store";
import type { AdminUser, Database } from "@/lib/data/types";

export type TeamFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "password" | "current" | "confirm", string>>;
  /** Shown once to the administrator after creating a user or resetting a password. */
  secret?: { email: string; password: string };
  nonce?: number;
};

const roleKeys = Object.keys(roles) as [Role, ...Role[]];
const nameSchema = z.string().trim().min(2, "Indiquez un nom.").max(80);
const emailSchema = z.email("Adresse e-mail invalide.").transform((v) => v.trim().toLowerCase());
const passwordSchema = z.string().min(PASSWORD_MIN, `Au moins ${PASSWORD_MIN} caractères.`).max(200);

function refresh() {
  revalidatePath("/dashboard", "layout");
}

function activeAdmins(db: Database) {
  return db.users.filter((u) => u.active && u.role === "admin");
}

function fieldErrors(error: z.ZodError): TeamFormState["errors"] {
  const errors: TeamFormState["errors"] = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof NonNullable<TeamFormState["errors"]>;
    errors[key] ??= issue.message;
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/* Administrators: manage the team                                     */
/* ------------------------------------------------------------------ */

export async function createUser(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  await requireUser("users");
  const parsed = z
    .object({ name: nameSchema, email: emailSchema, role: z.enum(roleKeys), password: z.string() })
    .safeParse({
      name: formData.get("name"),
      email: String(formData.get("email") ?? ""),
      role: formData.get("role"),
      password: String(formData.get("password") ?? ""),
    });
  if (!parsed.success) return { status: "error", message: "Vérifiez les champs indiqués.", errors: fieldErrors(parsed.error) };

  const { name, email, role } = parsed.data;
  const password = parsed.data.password || generatePassword();
  if (password.length < PASSWORD_MIN) {
    return { status: "error", errors: { password: `Au moins ${PASSWORD_MIN} caractères, ou laissez vide pour en générer un.` } };
  }
  const passwordHash = await hashPassword(password);

  const created = await mutateDatabase((db) => {
    if (db.users.some((u) => u.email === email)) return false;
    const user: AdminUser = {
      id: randomUUID(),
      name,
      email,
      role,
      passwordHash,
      active: true,
      sessionVersion: 1,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    db.users.push(user);
    return true;
  });
  if (!created) return { status: "error", errors: { email: "Un compte utilise déjà cette adresse." } };

  refresh();
  return {
    status: "success",
    message: `${name} peut maintenant se connecter.`,
    secret: { email, password },
    nonce: Date.now(),
  };
}

type UpdateResult = { ok: true } | { ok: false; error: string };

export async function updateUser(formData: FormData): Promise<UpdateResult> {
  const me = await requireUser("users");
  const id = String(formData.get("id") ?? "");
  const role = formData.get("role") as Role | null;
  const active = formData.get("active");

  const result = await mutateDatabase<UpdateResult>((db) => {
    const user = db.users.find((u) => u.id === id);
    if (!user) return { ok: false, error: "Compte introuvable." };
    const nextRole = role && roleKeys.includes(role) ? role : user.role;
    const nextActive = active === null ? user.active : active === "true";
    if (user.id === me.id && (nextRole !== "admin" || !nextActive)) {
      return { ok: false, error: "Vous ne pouvez pas retirer vos propres droits d’administrateur." };
    }
    const losesAdmin = user.role === "admin" && user.active && (nextRole !== "admin" || !nextActive);
    if (losesAdmin && activeAdmins(db).length <= 1) {
      return { ok: false, error: "Le cabinet doit garder au moins un administrateur actif." };
    }
    if (nextActive !== user.active || nextRole !== user.role) user.sessionVersion += 1;
    user.role = nextRole;
    user.active = nextActive;
    return { ok: true };
  });
  refresh();
  return result;
}

export async function resetUserPassword(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const me = await requireUser("users");
  const id = String(formData.get("id") ?? "");
  if (id === me.id) return { status: "error", message: "Changez votre propre mot de passe depuis « Mon compte »." };
  const password = generatePassword();
  const passwordHash = await hashPassword(password);
  const email = await mutateDatabase((db) => {
    const user = db.users.find((u) => u.id === id);
    if (!user) return null;
    user.passwordHash = passwordHash;
    user.mustChangePassword = true;
    user.sessionVersion += 1; // signs the user out everywhere
    return user.email;
  });
  if (!email) return { status: "error", message: "Compte introuvable." };
  refresh();
  return { status: "success", secret: { email, password }, nonce: Date.now() };
}

export async function deleteUser(formData: FormData): Promise<UpdateResult> {
  const me = await requireUser("users");
  const id = String(formData.get("id") ?? "");
  if (id === me.id) return { ok: false, error: "Vous ne pouvez pas supprimer votre propre compte." };
  const result = await mutateDatabase<UpdateResult>((db) => {
    const user = db.users.find((u) => u.id === id);
    if (!user) return { ok: false, error: "Compte introuvable." };
    if (user.role === "admin" && user.active && activeAdmins(db).length <= 1) {
      return { ok: false, error: "Le cabinet doit garder au moins un administrateur actif." };
    }
    db.users = db.users.filter((u) => u.id !== id);
    return { ok: true };
  });
  refresh();
  return result;
}

/* ------------------------------------------------------------------ */
/* Every member: own account                                           */
/* ------------------------------------------------------------------ */

export async function updateProfile(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const me = await requireUser();
  const parsed = z
    .object({ name: nameSchema, email: emailSchema })
    .safeParse({ name: formData.get("name"), email: String(formData.get("email") ?? "") });
  if (!parsed.success) return { status: "error", message: "Vérifiez les champs indiqués.", errors: fieldErrors(parsed.error) };

  const ok = await mutateDatabase((db) => {
    if (db.users.some((u) => u.email === parsed.data.email && u.id !== me.id)) return false;
    const user = db.users.find((u) => u.id === me.id);
    if (!user) return false;
    user.name = parsed.data.name;
    user.email = parsed.data.email;
    return true;
  });
  if (!ok) return { status: "error", errors: { email: "Un autre compte utilise déjà cette adresse." } };
  refresh();
  return { status: "success", message: "Profil mis à jour.", nonce: Date.now() };
}

export async function changePassword(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const me = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const check = passwordSchema.safeParse(next);
  if (!check.success) return { status: "error", errors: { password: check.error.issues[0]?.message } };
  if (next !== confirm) return { status: "error", errors: { confirm: "Les deux mots de passe ne correspondent pas." } };

  const passwordHash = await hashPassword(next);
  const outcome = await mutateDatabase(async (db) => {
    const user = db.users.find((u) => u.id === me.id);
    if (!user) return "missing" as const;
    if (!(await verifyPassword(current, user.passwordHash))) return "wrong" as const;
    user.passwordHash = passwordHash;
    user.mustChangePassword = false;
    user.sessionVersion += 1; // other devices are signed out
    return { id: user.id, sessionVersion: user.sessionVersion };
  });
  if (outcome === "missing") return { status: "error", message: "Compte introuvable." };
  if (outcome === "wrong") return { status: "error", errors: { current: "Mot de passe actuel incorrect." } };

  await startSession(outcome); // keep this device signed in
  refresh();
  return { status: "success", message: "Mot de passe modifié. Vos autres appareils ont été déconnectés.", nonce: Date.now() };
}
