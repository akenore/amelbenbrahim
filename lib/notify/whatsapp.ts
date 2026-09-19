import "server-only";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { access } from "@/lib/auth/roles";
import { patientTypes, type AppointmentRequest } from "@/lib/data/types";
import { getDb } from "@/lib/db";
import { notifications, users } from "@/lib/db/schema";
import { formatWhatsapp, normalizeWhatsapp } from "@/lib/phone";

// WhatsApp alerts through the official WhatsApp Business Cloud API (Meta).
// A message sent first by a business must use a template approved by Meta:
// see README.md for the template text and its four variables.

type Config = { token: string; phoneNumberId: string; template: string; language: string; apiUrl: string };

export function whatsappConfig(): Config | null {
  const token = process.env.WHATSAPP_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!token || !phoneNumberId) return null;
  return {
    token,
    phoneNumberId,
    template: process.env.WHATSAPP_TEMPLATE?.trim() || "nouvelle_demande_rdv",
    language: process.env.WHATSAPP_TEMPLATE_LANG?.trim() || "fr",
    // WHATSAPP_API_URL only needs changing for tests (a local mock of the Graph API).
    apiUrl: `${process.env.WHATSAPP_API_URL?.trim() || "https://graph.facebook.com"}/${process.env.WHATSAPP_API_VERSION?.trim() || "v23.0"}`,
  };
}

/** Template variables may not contain line breaks, tabs or more than four spaces in a row. */
function param(value: string, max = 160) {
  const clean = value.replace(/\s+/g, " ").trim();
  return (clean || "Non précisé").slice(0, max);
}

type SendResult = { ok: true; id: string | null } | { ok: false; error: string };

async function sendTemplate(config: Config, to: string, values: string[]): Promise<SendResult> {
  try {
    const res = await fetch(`${config.apiUrl}/${config.phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${config.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "template",
        template: {
          name: config.template,
          language: { code: config.language },
          components: [{ type: "body", parameters: values.map((text) => ({ type: "text", text: param(text) })) }],
        },
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.json().catch(() => null)) as {
      messages?: { id?: string }[];
      error?: { message?: string; error_data?: { details?: string } };
    } | null;
    if (!res.ok) return { ok: false, error: body?.error?.error_data?.details || body?.error?.message || `HTTP ${res.status}` };
    return { ok: true, id: body?.messages?.[0]?.id ?? null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

function templateValues(request: Pick<AppointmentRequest, "name" | "phone" | "patient" | "treatment" | "preferredTime">) {
  const phone = normalizeWhatsapp(request.phone);
  return [
    request.name,
    phone ? formatWhatsapp(phone) : request.phone,
    [patientTypes[request.patient], request.treatment].filter(Boolean).join(" · "),
    request.preferredTime || "Non précisées",
  ];
}

/** Active members allowed to see appointment requests who asked for alerts. */
export async function alertRecipients() {
  return getDb()
    .select({ id: users.id, name: users.name, whatsapp: users.whatsapp })
    .from(users)
    .where(
      and(
        eq(users.active, true),
        eq(users.notifyWhatsapp, true),
        isNotNull(users.whatsapp),
        inArray(users.role, [...access.requests]),
      ),
    );
}

type Recipient = { id: string; name: string; whatsapp: string | null };

async function deliver(config: Config, recipients: Recipient[], values: string[], requestId: string | null) {
  const results = await Promise.all(
    recipients.map(async (r) => ({ recipient: r, result: await sendTemplate(config, r.whatsapp ?? "", values) })),
  );
  if (results.length) {
    await getDb()
      .insert(notifications)
      .values(
        results.map(({ recipient, result }) => ({
          requestId,
          userId: recipient.id,
          recipient: recipient.whatsapp ?? "",
          recipientName: recipient.name,
          status: result.ok ? ("sent" as const) : ("failed" as const),
          providerId: result.ok ? result.id : null,
          error: result.ok ? null : result.error.slice(0, 500),
        })),
      );
  }
  for (const { recipient, result } of results) {
    if (!result.ok) console.error(`[whatsapp] échec de l’envoi à ${recipient.name} : ${result.error}`);
  }
  return results;
}

/** Alerts the team about a new appointment request. Never throws: the request is already saved. */
export async function notifyNewRequest(request: AppointmentRequest) {
  try {
    const config = whatsappConfig();
    if (!config) return;
    const recipients = await alertRecipients();
    await deliver(config, recipients, templateValues(request), request.id);
  } catch (error) {
    console.error("[whatsapp] alerte non envoyée :", error);
  }
}

/** Sends the alert template with sample values to one member, to check the setup. */
export async function sendTestAlert(member: Recipient): Promise<SendResult> {
  const config = whatsappConfig();
  if (!config) return { ok: false, error: "WhatsApp n’est pas configuré sur le serveur." };
  const values = templateValues({
    name: "Test : patient exemple",
    phone: "",
    patient: "adulte",
    treatment: "Message de test depuis l’espace cabinet",
    preferredTime: "Aucune action à faire",
  });
  const [{ result }] = await deliver(config, [member], values, null);
  return result;
}
