import type { Metadata } from "next";
import { Avatar } from "@/components/dashboard/Avatar";
import { AlertsForm, PasswordForm, ProfileForm } from "@/components/dashboard/team/AccountForms";
import { can, roles } from "@/lib/auth/roles";
import { requireUser } from "@/lib/auth/session";
import { whatsappConfig } from "@/lib/notify/whatsapp";

export const metadata: Metadata = { title: "Mon compte" };

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-4xl">
      <header className="flex items-center gap-5">
        <Avatar name={user.name} />
        <div>
          <h1 className="font-display text-4xl leading-tight md:text-5xl">Mon compte</h1>
          <p className="mt-1 text-ink-muted">
            {roles[user.role].label} · {roles[user.role].description}
          </p>
        </div>
      </header>
      <div className="mt-10 space-y-6">
        <ProfileForm user={user} />
        {can(user.role, "requests") && <AlertsForm user={user} ready={whatsappConfig() !== null} />}
        <PasswordForm />
      </div>
    </div>
  );
}
