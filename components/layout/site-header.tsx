"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useTheme, useTranslations } from "@/components/providers/app-providers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const { theme, toggleTheme } = useTheme();
  const navItems = [
    { key: "features", href: "#features" },
    { key: "howItWorks", href: "#how-it-works" },
    { key: "pricing", href: "#pricing" },
    { key: "faqs", href: "#faqs" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-white/80 text-stone-900 backdrop-blur-md transition-all dark:border-border-dark dark:bg-background-dark/80 dark:text-white">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="material-symbols-outlined filled-icon text-primary text-[32px]">
            wb_sunny
          </span>
          <span className="text-xl font-bold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={cn(
                "transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-primary"
                  : "text-stone-600 dark:text-stone-300",
              )}
            >
              {t.navigation[item.key]}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            variant="outline"
            className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
          >
            <Link href={siteConfig.cta.secondary as Route}>
              {t.navigation.signIn}
            </Link>
          </Button>
          <Button
            asChild
            className="bg-primary text-white shadow-lg shadow-orange-500/20 hover:bg-primary-hover"
          >
            <Link href={siteConfig.cta.primary as Route}>
              {t.navigation.createAccount}
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <LanguageSwitcher
            className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
          />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <LanguageSwitcher
            showLabel={false}
            size="icon"
            className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
          />
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
                aria-label="Toggle navigation"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.key} asChild>
                  <a href={item.href}>{t.navigation[item.key]}</a>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link href={siteConfig.cta.secondary as Route}>
                  {t.navigation.signIn}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={siteConfig.cta.primary as Route}>
                  {t.navigation.createAccount}
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
