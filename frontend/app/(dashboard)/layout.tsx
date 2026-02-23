import { AppSidebar, AppHeader } from "@/app/Components/navigation";
import { AuthGuard } from "@/app/Components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AppSidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </AuthGuard>
  );
}
