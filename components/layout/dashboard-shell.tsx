"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslations } from "@/components/providers/app-providers";
import { siteConfig } from "@/config/site";
import { OnboardingTour } from "@/components/onboarding/onboarding-tour";
import { publicEnv } from "@/lib/env";

interface DashboardShellProps {
  children: ReactNode;
  showModeration?: boolean;
  showAdmin?: boolean;
}

export function DashboardShell({
  children,
  showModeration = false,
  showAdmin = false,
}: DashboardShellProps) {
  const t = useTranslations();

  return (
    <div className="grid min-h-screen bg-background-light text-stone-900 dark:bg-background-dark dark:text-white md:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-stone-200 bg-white p-6 md:flex md:flex-col dark:border-stone-800 dark:bg-stone-900">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="material-symbols-outlined filled-icon text-primary text-[28px]">
            wb_sunny
          </span>
          <span className="text-lg font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-stone-400">
          {t.dashboard.workspaceTitle}
        </div>
        <div className="mt-4">
          <DashboardNav showModeration={showModeration} showAdmin={showAdmin} />
        </div>
        <div className="mt-auto text-xs text-stone-500 dark:text-stone-400">
          {t.dashboard.needHelp}
          <br />
          {publicEnv.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@soleilroute.app"}
        </div>
      </aside>
      <div className="flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 bg-background-light dark:bg-background-dark">
          {children}
        </ScrollArea>
      </div>
      <OnboardingTour />
    </div>
  );
}
