"use server";

import { after } from "next/server";
import { z } from "zod";
import { patientTypes, type PatientType } from "@/lib/data/types";
import { getDb } from "@/lib/db";
import { toRequest } from "@/lib/db/mappers";
import { appointmentRequests } from "@/lib/db/schema";
import { notifyNewRequest } from "@/lib/notify/whatsapp";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export type AppointmentState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "phone" | "email" | "patient" | "consent", string>>;
  values?: Record<string, string>;
};

const schema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom et prénom.").max(120),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s.-]/g, ""))
    .pipe(z.string().regex(/^(\+?216)?\d{8}$|^\+\d{8,15}$/, "Indiquez un numéro de téléphone valide.")),
  email: z.union([z.literal(""), z.email("Adresse e-mail invalide.")]),
  patient: z.enum(Object.keys(patientTypes) as [PatientType, ...PatientType[]], "Précisez qui consulte."),
  treatment: z.string().trim().max(120),
  preferredTime: z.string().trim().max(120),
  message: z.string().trim().max(2000),
  consent: z.literal("on", "Merci d’accepter d’être recontacté."),
});

export async function requestAppointment(_prev: AppointmentState, formData: FormData): Promise<AppointmentState> {
  const raw = Object.fromEntries(
    ["name", "phone", "email", "patient", "treatment", "preferredTime", "message", "consent"].map((k) => [
      k,
      String(formData.get(k) ?? ""),
    ]),
  );

  // Honeypot: real visitors never fill this hidden field.
  if (String(formData.get("website") ?? "") !== "") return { status: "success" };

  if (!rateLimit(`rdv:${await clientIp()}`, 5, 60 * 60 * 1000)) {
    return {
      status: "error",
      message: "Trop de demandes envoyées. Merci de nous appeler directement.",
      values: raw,
    };
  }

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: AppointmentState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<AppointmentState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "Merci de vérifier les champs indiqués.", errors, values: raw };
  }

  const { name, phone, email, patient, treatment, preferredTime, message } = parsed.data;
  let saved;
  try {
    [saved] = await getDb()
      .insert(appointmentRequests)
      .values({ name, phone, email, patient, treatment, preferredTime, message })
      .returning();
  } catch (error) {
    console.error("[rendez-vous]", error);
    return {
      status: "error",
      message: "Votre demande n’a pas pu être enregistrée. Merci de réessayer ou de nous appeler directement.",
      values: raw,
    };
  }

  // The visitor gets the confirmation right away; the team alert is sent afterwards.
  const request = toRequest(saved);
  after(() => notifyNewRequest(request));

  return { status: "success" };
}
