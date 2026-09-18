import { Sidebar } from "@/components/dashboard/Sidebar";
import { getOverview } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth/session";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const { newRequests } = await getOverview();
  return (
    <div className="lg:flex">
      <Sidebar newRequests={newRequests} />
      <div className="min-w-0 flex-1 px-4 py-8 md:px-10 md:py-12">{children}</div>
    </div>
  );
}
