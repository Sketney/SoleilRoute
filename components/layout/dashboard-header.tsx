"use client";

import Link from "next/link";
import { HelpCircle, Home, LogOut, Moon, Settings, Sun } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useTheme, useTranslations } from "@/components/providers/app-providers";
import { NotificationsMenu } from "@/components/notifications/notifications-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  email?: string;
  title?: string;
  subtitle?: string;
  showNotifications?: boolean;
}

export function DashboardHeader({
  email,
  title,
  subtitle,
  showNotifications = true,
}: DashboardHeaderProps) {
  const initials = email ? email.slice(0, 2).toUpperCase() : "TP";
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations();
  const resolvedTitle = title ?? t.dashboard.headerTitle;
  const resolvedSubtitle = subtitle ?? t.dashboard.headerSubtitle;
  const themeLabel =
    theme === "dark" ? t.dashboard.themeLight : t.dashboard.themeDark;

  return (
    <header className="flex flex-col gap-4 border-b border-stone-200 bg-white/90 px-4 py-4 text-stone-900 backdrop-blur md:flex-row md:items-center md:justify-between dark:border-stone-800 dark:bg-stone-900/90 dark:text-white">
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          {resolvedTitle}
        </h1>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {resolvedSubtitle}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white"
        >
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            {t.dashboard.home}
          </Link>
        </Button>
        <LanguageSwitcher
          showLabel={false}
          size="icon"
          variant="outline"
          className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
        />
        {showNotifications ? <NotificationsMenu /> : null}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-9 w-9 rounded-full p-0 text-stone-700 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-200 dark:hover:bg-stone-800 dark:hover:text-white"
              aria-label="Account menu"
              data-tour="header-profile"
            >
              <Avatar>
                <AvatarFallback
                  className={cn("bg-primary/20 text-primary")}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            {email ? (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="text-xs text-muted-foreground">
                    {t.dashboard.signedInAs}
                  </div>
                  <div className="truncate text-sm font-medium">{email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
              </>
            ) : null}
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {t.dashboard.accountSettings}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                toggleTheme();
              }}
            >
              <span className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                {themeLabel}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/help" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                {t.dashboard.help}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/sign-out" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                {t.dashboard.signOut}
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
