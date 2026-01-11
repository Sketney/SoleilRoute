"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Compass,
  Globe2,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  Bell,
  Settings,
  MessageSquare,
  Shield,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/components/providers/app-providers";
import type { Translations } from "@/lib/i18n";

export function DashboardNav({
  showModeration = false,
  showAdmin = false,
}: {
  showModeration?: boolean;
  showAdmin?: boolean;
}) {
  const pathname = usePathname();
  const t = useTranslations();

  type NavKey = keyof Translations["navigation"];
  type NavItem = {
    key: NavKey;
    href: string;
    icon: LucideIcon;
  };

  const navItems: NavItem[] = [
    { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
    { key: "trips", href: "/dashboard/trips", icon: Compass },
    { key: "budgetPlanner", href: "/dashboard/budget", icon: ListChecks },
    { key: "visaChecker", href: "/dashboard/visa", icon: Globe2 },
    { key: "community", href: "/dashboard/community", icon: MessageSquare },
    { key: "notifications", href: "/dashboard/notifications", icon: Bell },
    { key: "settings", href: "/dashboard/settings", icon: Settings },
    { key: "help", href: "/help", icon: HelpCircle },
  ];

  if (showModeration) {
    navItems.splice(6, 0, {
      key: "moderation",
      href: "/dashboard/moderation",
      icon: Shield,
    });
  }

  if (showAdmin) {
    navItems.splice(showModeration ? 7 : 6, 0, {
      key: "admin",
      href: "/dashboard/admin",
      icon: Users,
    });
  }

  return (
    <nav className="grid gap-1">
      {navItems.map((link) => {
        const active =
          link.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname?.startsWith(link.href);
        return (
          <Link
            key={link.key}
            href={link.href as Route}
            data-tour={`nav-${link.key}`}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
              active
                ? "bg-primary/10 text-primary"
                : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white",
            )}
          >
            <link.icon className="h-4 w-4" />
            {t.navigation[link.key]}
          </Link>
        );
      })}
    </nav>
  );
}
