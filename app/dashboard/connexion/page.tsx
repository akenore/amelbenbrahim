import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Monogram } from "@/components/brand/Monogram";
import { LoginForm } from "@/components/dashboard/LoginForm";
import { getCurrentUser } from "@/lib/auth/session";
import { photos } from "@/lib/images";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <div className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#0d0d0e] lg:block">
        <Image src={photos.reception.src} alt="" fill preload placeholder="blur" sizes="50vw" className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0e] via-[#0d0d0e]/40 to-transparent" />
        <div className="absolute bottom-14 left-14 right-14 text-[#f3efe6]">
          <Monogram animate strokeWidth={22} className="h-16 w-auto text-[#e4c68a]" />
          <p className="font-display mt-8 text-5xl leading-[1.08]">Espace cabinet</p>
          <p className="mt-4 max-w-sm text-[#f3efe6]/70">
            Publiez vos actualités et suivez les demandes de rendez-vous.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-bg px-4 py-16">
        <div className="w-full max-w-sm">
          <Monogram strokeWidth={24} className="h-10 w-auto text-gold lg:hidden" />
          <h1 className="font-display mt-8 text-4xl leading-tight lg:mt-0">Connexion</h1>
          <p className="mt-3 text-ink-soft">Accès réservé à l’équipe du cabinet du Dr. Amel Ben Brahim.</p>
          <div className="mt-10">
            <LoginForm />
          </div>
          <Link href="/" className="mt-10 inline-block text-sm text-ink-muted underline-offset-4 hover:text-ink hover:underline">
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
}
