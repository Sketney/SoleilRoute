"use client";

import { usePathname } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { useTranslations } from "@/components/providers/app-providers";

type DashboardHeaderRouteProps = {
  email?: string;
  showNotifications?: boolean;
};

export function DashboardHeaderRoute({
  email,
  showNotifications,
}: DashboardHeaderRouteProps) {
  const pathname = usePathname() ?? "";
  const t = useTranslations();

  const headerCopy = (() => {
    if (pathname.startsWith("/dashboard/budget")) {
      return {
        title: t.budgetPlanner.title,
        subtitle: t.budgetPlanner.description,
      };
    }
    if (pathname.startsWith("/dashboard/visa")) {
      return {
        title: t.visaChecker.title,
        subtitle: t.visaChecker.description,
      };
    }
    if (pathname.startsWith("/dashboard/notifications")) {
      return {
        title: t.notifications.historyTitle,
        subtitle: t.notifications.historySubtitle,
      };
    }
    if (pathname.startsWith("/dashboard/community")) {
      return {
        title: t.community.title,
        subtitle: t.community.subtitle,
      };
    }
    if (pathname.startsWith("/dashboard/moderation")) {
      return {
        title: t.moderation.title,
        subtitle: t.moderation.subtitle,
      };
    }
    if (pathname.startsWith("/dashboard/admin")) {
      return {
        title: t.admin.title,
        subtitle: t.admin.subtitle,
      };
    }
    if (pathname.startsWith("/dashboard/settings")) {
      return {
        title: t.settings.title,
        subtitle: t.settings.subtitle,
      };
    }
    if (pathname.startsWith("/dashboard/trips")) {
      return {
        title: t.navigation.trips,
        subtitle: t.tripsView.pageDescription,
      };
    }
    if (pathname.startsWith("/help")) {
      return {
        title: t.help.title,
        subtitle: t.help.subtitle,
      };
    }
    return {
      title: t.dashboard.headerTitle,
      subtitle: t.dashboard.headerSubtitle,
    };
  })();

  return (
    <DashboardHeader
      email={email}
      showNotifications={showNotifications}
      title={headerCopy.title}
      subtitle={headerCopy.subtitle}
    />
  );
}
