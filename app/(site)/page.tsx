import type { Metadata } from "next";
import { pageMeta } from "@/lib/metadata";
import { AgeProfiles } from "@/components/home/AgeProfiles";
import { ClinicMosaic } from "@/components/home/ClinicMosaic";
import { CtaBlock } from "@/components/home/CtaBlock";
import { DigitalSection } from "@/components/home/DigitalSection";
import { DoctorFeature } from "@/components/home/DoctorFeature";
import { FaqSection } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { Journey } from "@/components/home/Journey";
import { Manifesto } from "@/components/home/Manifesto";
import { NewsSection } from "@/components/home/NewsSection";
import { TreatmentsBento } from "@/components/home/TreatmentsBento";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeFaq } from "@/lib/faq";
import { faqSchema } from "@/lib/seo";

// News is refreshed on demand from the dashboard; this is a safety net.
export const metadata: Metadata = pageMeta({
  title: "Dr. Amel Ben Brahim | Orthodontiste à Nabeul, aligneurs invisibles",
  absoluteTitle: true,
  description:
    "Cabinet d’orthodontie du Dr. Amel Ben Brahim à Nabeul : aligneurs invisibles, orthodontie linguale, bagues céramique, traitements pour enfants et adultes.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
      <AgeProfiles />
      <TreatmentsBento />
      <DoctorFeature />
      <DigitalSection />
      <Journey />
      <ClinicMosaic />
      <NewsSection />
      <FaqSection />
      <CtaBlock />
      <JsonLd data={faqSchema(homeFaq)} />
    </>
  );
}
