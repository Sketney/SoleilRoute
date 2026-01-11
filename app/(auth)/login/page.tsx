import Link from "next/link";
import { LoginForm } from "@/components/forms/auth/login-form";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  return (
    <div className="mx-auto w-full max-w-[460px] rounded-xl border border-stone-200 bg-white p-8 shadow-xl dark:border-border-dark dark:bg-surface-dark">
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
            {t.auth.login.title}
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            {t.auth.login.subtitle}
          </p>
        </div>
        <Link
          href="/auth/google"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-stone-300 bg-white text-sm font-bold text-stone-700 transition-colors hover:bg-stone-50 dark:border-border-dark dark:bg-transparent dark:text-white dark:hover:bg-white/5"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google"
            className="h-5 w-5"
          />
          {t.auth.login.googleButton}
        </Link>
        <div className="relative flex items-center justify-center text-xs font-medium text-stone-400 dark:text-stone-500">
          <span className="absolute inset-x-0 h-px bg-stone-200 dark:bg-border-dark" />
          <span className="relative bg-white px-3 dark:bg-surface-dark">
            {t.auth.login.divider}
          </span>
        </div>
        <LoginForm />
        <div className="text-center text-sm text-stone-500 dark:text-stone-400">
          {t.auth.login.noAccount}{" "}
          <Button variant="link" className="px-1 text-primary" asChild>
            <Link href="/register">{t.auth.login.createAccount}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
