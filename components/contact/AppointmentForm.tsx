"use client";

import { useActionState, useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRightIcon, CheckCircleIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { requestAppointment, type AppointmentState } from "@/app/(site)/contact/actions";
import { patientTypes } from "@/lib/data/types";
import { site } from "@/lib/site";
import { treatments } from "@/lib/treatments";

const initial: AppointmentState = { status: "idle" };

const input =
  "w-full rounded-2xl bg-bg px-4 py-3.5 text-[16px] text-ink ring-1 ring-line-strong placeholder:text-ink-muted transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-gold-ink aria-invalid:ring-2 aria-invalid:ring-danger";

function Field({
  label,
  name,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[14px] text-ink-soft">
        {label}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-[13px] text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] text-danger" data-field={name}>
          {error}
        </p>
      )}
    </div>
  );
}

export function AppointmentForm() {
  const [state, action, pending] = useActionState(requestAppointment, initial);
  // Fields edited since the last server response: their stale errors are hidden.
  const [edited, setEdited] = useState<{ for: AppointmentState; names: Set<string> }>({ for: initial, names: new Set() });
  const editedNames = edited.for === state ? edited.names : new Set<string>();
  const v = state.values ?? {};
  const e = Object.fromEntries(
    Object.entries(state.errors ?? {}).filter(([name]) => !editedNames.has(name)),
  ) as NonNullable<AppointmentState["errors"]>;

  function markEdited(event: React.SyntheticEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name;
    if (!name || !state.errors?.[name as keyof NonNullable<AppointmentState["errors"]>]) return;
    setEdited((prev) => ({ for: state, names: new Set(prev.for === state ? prev.names : []).add(name) }));
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state.status === "success" ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex min-h-105 flex-col items-start justify-center"
          role="status"
        >
          <CheckCircleIcon size={56} weight="thin" className="text-gold-ink" />
          <h3 className="font-display mt-6 text-4xl leading-tight">Demande bien reçue.</h3>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-soft">
            Merci. Le secrétariat vous rappelle rapidement pour convenir d’un rendez-vous. Pour une demande urgente,
            appelez le {site.phones.landline.display}.
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          action={action}
          onInput={markEdited}
          onChange={markEdited}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          noValidate
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <Field label="Nom et prénom" name="name" error={e.name}>
            {(p) => <input {...p} name="name" autoComplete="name" required defaultValue={v.name} className={input} />}
          </Field>
          <Field label="Téléphone" name="phone" error={e.phone}>
            {(p) => (
              <input {...p} name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={v.phone} placeholder="Ex. 22 123 456" className={input} />
            )}
          </Field>
          <Field label="E-mail (facultatif)" name="email" error={e.email}>
            {(p) => <input {...p} name="email" type="email" autoComplete="email" defaultValue={v.email} className={input} />}
          </Field>
          <Field label="Traitement envisagé" name="treatment">
            {(p) => (
              <select {...p} name="treatment" defaultValue={v.treatment ?? ""} className={`${input} appearance-none`}>
                <option value="">Je ne sais pas encore</option>
                {treatments.map((t) => (
                  <option key={t.slug} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            )}
          </Field>

          <fieldset className="md:col-span-2" aria-describedby={e.patient ? "patient-error" : undefined}>
            <legend className="mb-3 text-[14px] text-ink-soft">Le rendez-vous concerne</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(patientTypes).map(([value, label]) => (
                <label key={value} className="cursor-pointer">
                  <input type="radio" name="patient" value={value} defaultChecked={v.patient === value} className="peer sr-only" />
                  <span className="inline-flex rounded-full px-5 py-2.5 text-[15px] ring-1 ring-line-strong transition-colors duration-300 peer-checked:bg-btn peer-checked:text-btn-ink peer-checked:ring-btn peer-focus-visible:ring-2 peer-focus-visible:ring-gold-ink">
                    {label}
                  </span>
                </label>
              ))}
            </div>
            {e.patient && (
              <p id="patient-error" className="mt-2 text-[13px] text-danger">
                {e.patient}
              </p>
            )}
          </fieldset>

          <Field label="Disponibilités (facultatif)" name="preferredTime" hint="Par exemple : mardi matin, en fin de journée…">
            {(p) => <input {...p} name="preferredTime" defaultValue={v.preferredTime} className={input} />}
          </Field>
          <div className="hidden md:block" />

          <div className="md:col-span-2">
            <Field label="Message (facultatif)" name="message">
              {(p) => <textarea {...p} name="message" rows={4} defaultValue={v.message} className={`${input} resize-y`} />}
            </Field>
          </div>

          {/* Honeypot */}
          <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
            <label>
              Site web
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
              <input
                type="checkbox"
                name="consent"
                defaultChecked={v.consent === "on"}
                aria-invalid={Boolean(e.consent)}
                className="mt-1 h-4 w-4 shrink-0 accent-(--gold-ink)"
              />
              J’accepte que ces informations soient utilisées par le cabinet uniquement pour me recontacter au sujet de ma
              demande.
            </label>
            {e.consent && <p className="mt-2 text-[13px] text-danger">{e.consent}</p>}
          </div>

          <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
            {state.status === "error" && state.message ? (
              <p role="alert" className="flex items-center gap-2 text-[14px] text-danger">
                <WarningCircleIcon size={18} weight="light" /> {state.message}
              </p>
            ) : (
              <p className="text-[13px] text-ink-muted">Réponse du secrétariat par téléphone.</p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="group inline-flex items-center justify-between gap-3 self-start rounded-full bg-btn py-1.5 pl-6 pr-1.5 text-[15px] text-btn-ink shadow-luxe transition-[transform,opacity] duration-500 ease-luxe active:scale-[0.98] disabled:opacity-60 md:self-auto"
            >
              {pending ? "Envoi en cours…" : "Envoyer la demande"}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-btn-icon transition-transform duration-500 ease-luxe group-hover:-translate-y-px group-hover:translate-x-0.5">
                <ArrowUpRightIcon size={16} weight="light" />
              </span>
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
