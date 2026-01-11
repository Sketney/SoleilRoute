import Link from "next/link";
import { RegisterForm } from "@/components/forms/auth/register-form";
import { Button } from "@/components/ui/button";
import { getTranslations } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata = {
  title: "Create account",
};

export default async function RegisterPage() {
  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-4 py-6 lg:flex-row lg:items-stretch">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 hidden flex-1 flex-col justify-center lg:flex">
        <div className="group relative overflow-hidden rounded-2xl shadow-2xl">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <img
            alt="Scenic mountain landscape"
            className="h-[600px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute bottom-0 left-0 z-20 p-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                Travel Smart
              </span>
              <span className="rounded-full border border-white/10 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                Plan Better
              </span>
            </div>
            <h2 className="mb-2 text-3xl font-bold leading-tight text-white">
              Your next adventure starts here.
            </h2>
            <p className="max-w-md text-base text-stone-300">
              Collaborate with friends, track expenses, and manage your
              itinerary all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[480px] flex-1">
        <div className="rounded-2xl border border-stone-200 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                {t.auth.register.title}
              </h1>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {t.auth.register.subtitle}
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
              {t.auth.register.googleButton}
            </Link>
            <div className="relative flex items-center justify-center text-xs font-medium text-stone-400 dark:text-stone-500">
              <span className="absolute inset-x-0 h-px bg-stone-200 dark:bg-border-dark" />
              <span className="relative bg-white px-3 dark:bg-stone-900">
                {t.auth.register.divider}
              </span>
            </div>
            <RegisterForm />
            <div className="text-center text-sm text-stone-500 dark:text-stone-400">
              {t.auth.register.haveAccount}{" "}
              <Button variant="link" className="px-1 text-primary" asChild>
                <Link href="/login">{t.auth.register.signIn}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
