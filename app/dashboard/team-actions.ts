"use server";

import { revalidatePath } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { PASSWORD_MIN, generatePassword, hashPassword, verifyPassword } from "@/lib/auth/password";
import { roles, type Role } from "@/lib/auth/roles";
import { requireUser, startSession } from "@/lib/auth/session";
import { getDb, pgCode, type Tx } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendTestAlert } from "@/lib/notify/whatsapp";
import { formatWhatsapp, normalizeWhatsapp } from "@/lib/phone";
import { rateLimit } from "@/lib/rate-limit";

export type TeamFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "password" | "current" | "confirm" | "whatsapp", string>>;
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Locks the administrator rows, so two admins cannot demote each other at the same time. */
async function activeAdminCount(tx: Tx) {
  const rows = await tx
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.role, "admin"), eq(users.active, true)))
    .for("update");
  return rows.length;
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

  try {
    await getDb().insert(users).values({ name, email, role, passwordHash, mustChangePassword: true });
  } catch (error) {
    if (pgCode(error) !== "23505") throw error;
    return { status: "error", errors: { email: "Un compte utilise déjà cette adresse." } };
  }

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

  if (!UUID.test(id)) return { ok: false, error: "Compte introuvable." };

  const result = await getDb().transaction(async (tx): Promise<UpdateResult> => {
    const admins = await activeAdminCount(tx);
    const [user] = await tx.select().from(users).where(eq(users.id, id)).for("update");
    if (!user) return { ok: false, error: "Compte introuvable." };
    const nextRole = role && roleKeys.includes(role) ? role : user.role;
    const nextActive = active === null ? user.active : active === "true";
    if (user.id === me.id && (nextRole !== "admin" || !nextActive)) {
      return { ok: false, error: "Vous ne pouvez pas retirer vos propres droits d’administrateur." };
    }
    const losesAdmin = user.role === "admin" && user.active && (nextRole !== "admin" || !nextActive);
    if (losesAdmin && admins <= 1) {
      return { ok: false, error: "Le cabinet doit garder au moins un administrateur actif." };
    }
    const changed = nextActive !== user.active || nextRole !== user.role;
    await tx
      .update(users)
      .set({
        role: nextRole,
        active: nextActive,
        // Signs the user out everywhere when their access changes.
        ...(changed ? { sessionVersion: sql`${users.sessionVersion} + 1` } : null),
        // Patient data alerts follow access to the requests.
        ...(nextRole === "editor" ? { notifyWhatsapp: false } : null),
      })
      .where(eq(users.id, id));
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
  if (!UUID.test(id)) return { status: "error", message: "Compte introuvable." };
  const [updated] = await getDb()
    .update(users)
    // A new session version signs the user out everywhere.
    .set({ passwordHash, mustChangePassword: true, sessionVersion: sql`${users.sessionVersion} + 1` })
    .where(eq(users.id, id))
    .returning({ email: users.email });
  const email = updated?.email;
  if (!email) return { status: "error", message: "Compte introuvable." };
  refresh();
  return { status: "success", secret: { email, password }, nonce: Date.now() };
}

export async function deleteUser(formData: FormData): Promise<UpdateResult> {
  const me = await requireUser("users");
  const id = String(formData.get("id") ?? "");
  if (id === me.id) return { ok: false, error: "Vous ne pouvez pas supprimer votre propre compte." };
  if (!UUID.test(id)) return { ok: false, error: "Compte introuvable." };
  const result = await getDb().transaction(async (tx): Promise<UpdateResult> => {
    const admins = await activeAdminCount(tx);
    const [user] = await tx.select().from(users).where(eq(users.id, id)).for("update");
    if (!user) return { ok: false, error: "Compte introuvable." };
    if (user.role === "admin" && user.active && admins <= 1) {
      return { ok: false, error: "Le cabinet doit garder au moins un administrateur actif." };
    }
    await tx.delete(users).where(eq(users.id, id));
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

  let ok = true;
  try {
    await getDb().update(users).set({ name: parsed.data.name, email: parsed.data.email }).where(eq(users.id, me.id));
  } catch (error) {
    if (pgCode(error) !== "23505") throw error;
    ok = false;
  }
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
  const outcome = await getDb().transaction(async (tx) => {
    const [user] = await tx.select().from(users).where(eq(users.id, me.id)).for("update");
    if (!user) return "missing" as const;
    if (!(await verifyPassword(current, user.passwordHash))) return "wrong" as const;
    const [updated] = await tx
      .update(users)
      // Other devices are signed out.
      .set({ passwordHash, mustChangePassword: false, sessionVersion: sql`${users.sessionVersion} + 1` })
      .where(eq(users.id, me.id))
      .returning({ id: users.id, sessionVersion: users.sessionVersion });
    return updated;
  });
  if (outcome === "missing") return { status: "error", message: "Compte introuvable." };
  if (outcome === "wrong") return { status: "error", errors: { current: "Mot de passe actuel incorrect." } };

  await startSession(outcome); // keep this device signed in
  refresh();
  return { status: "success", message: "Mot de passe modifié. Vos autres appareils ont été déconnectés.", nonce: Date.now() };
}

/* ------------------------------------------------------------------ */
/* Members who handle appointment requests: WhatsApp alerts            */
/* ------------------------------------------------------------------ */

export async function updateAlerts(_prev: TeamFormState, formData: FormData): Promise<TeamFormState> {
  const me = await requireUser("requests");
  const raw = String(formData.get("whatsapp") ?? "").trim();
  const notify = formData.get("notify") === "on";
  const whatsapp = raw ? normalizeWhatsapp(raw) : null;
  if (raw && !whatsapp) {
    return { status: "error", errors: { whatsapp: "Numéro invalide. Exemples : 98 123 456 ou +33 6 12 34 56 78." } };
  }
  if (notify && !whatsapp) return { status: "error", errors: { whatsapp: "Indiquez le numéro qui recevra les alertes." } };

  await getDb().update(users).set({ whatsapp, notifyWhatsapp: notify }).where(eq(users.id, me.id));
  refresh();
  return {
    status: "success",
    message: notify ? "Alertes WhatsApp activées." : "Préférences enregistrées : aucune alerte ne vous sera envoyée.",
    nonce: Date.now(),
  };
}

export async function sendWhatsappTest(): Promise<{ ok: boolean; message: string }> {
  const me = await requireUser("requests");
  if (!rateLimit(`whatsapp-test:${me.id}`, 5, 60 * 60 * 1000)) {
    return { ok: false, message: "Trop de messages de test. Réessayez dans une heure." };
  }
  const [row] = await getDb().select({ whatsapp: users.whatsapp }).from(users).where(eq(users.id, me.id)).limit(1);
  if (!row?.whatsapp) return { ok: false, message: "Enregistrez d’abord votre numéro WhatsApp." };
  const result = await sendTestAlert({ id: me.id, name: me.name, whatsapp: row.whatsapp });
  return result.ok
    ? { ok: true, message: `Message de test envoyé au ${formatWhatsapp(row.whatsapp)}.` }
    : { ok: false, message: `L’envoi a échoué : ${result.error}` };
}
