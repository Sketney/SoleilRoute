import type { ReactNode } from "react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background-light px-4 py-12 text-stone-900 dark:bg-background-dark dark:text-white">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher
          size="sm"
          className="border-stone-200 bg-white text-stone-700 hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-stone-200 dark:hover:bg-white/5"
        />
      </div>
      <div className="mb-8 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="flex size-12 items-center justify-center rounded-xl bg-primary/20 text-primary"
        >
          <span className="material-symbols-outlined filled-icon text-3xl">
            wb_sunny
          </span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">{siteConfig.name}</h1>
      </div>
      <div className="w-full">{children}</div>
      <div className="mt-10 text-center text-xs text-stone-400 dark:text-stone-600">
        &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
        reserved.
      </div>
    </div>
  );
}
