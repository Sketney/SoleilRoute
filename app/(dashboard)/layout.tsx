import type { ReactNode } from "react";
import { DashboardHeaderRoute } from "@/components/layout/dashboard-header-route";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getServerSession } from "@/lib/auth/session";
import { isAdminEmail, isModerator } from "@/lib/auth/roles";
import { redirect } from "next/navigation";
import { getUserById } from "@/server/db";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const user = getUserById(session.user.id);

  const showAdmin = isAdminEmail(user?.email ?? null);
  const showModeration = isModerator(user);

  return (
    <DashboardShell showAdmin={showAdmin} showModeration={showModeration}>
      <div className="flex min-h-screen flex-col p-4 md:p-6">
        <div className="flex min-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg dark:border-stone-800 dark:bg-stone-900">
          <DashboardHeaderRoute
            email={session.user.email}
            showNotifications={user?.notifications_in_app_enabled ?? true}
          />
          <div className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto flex w-full flex-col gap-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
