import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Espace cabinet", template: "%s | Espace cabinet" },
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-sunken">{children}</div>;
}
