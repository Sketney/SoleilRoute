"use client";

import Link from "next/link";
import type { Route } from "next";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/providers/app-providers";

export function HeroSection() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute bottom-0 left-0 h-[520px] w-[520px] -translate-x-1/3 translate-y-1/3 rounded-full bg-rose-500/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-12 md:px-10 md:py-20 lg:py-24 lg:flex-row lg:items-center lg:gap-20">
        <div className="flex flex-1 flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <span className="material-symbols-outlined filled-icon text-[18px]">
              light_mode
            </span>
            {t.hero.pill}
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl dark:text-white">
              {t.hero.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">
                {siteConfig.name}
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-stone-600 dark:text-stone-400">
              {t.hero.description}
            </p>
          </div>
          <div className="flex w-full flex-wrap gap-4 sm:w-auto">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-lg bg-primary text-white shadow-lg shadow-orange-500/25 hover:bg-primary-hover"
            >
              <Link href={siteConfig.cta.primary as Route}>
                {t.navigation.startPlanning}
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-lg border-stone-300 text-stone-900 hover:bg-orange-50 dark:border-border-dark dark:text-white dark:hover:bg-white/5"
            >
              <Link href={"#features" as Route}>
                {t.navigation.exploreFeatures}
              </Link>
            </Button>
          </div>
          <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white/60 p-3 backdrop-blur-sm dark:border-border-dark dark:bg-surface-dark/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                <span className="material-symbols-outlined">shield_moon</span>
              </div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {t.hero.highlightOne}
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white/60 p-3 backdrop-blur-sm dark:border-border-dark dark:bg-surface-dark/60">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10 text-sky-600">
                <span className="material-symbols-outlined">flight_takeoff</span>
              </div>
              <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                {t.hero.highlightTwo}
              </span>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-1 items-center justify-center lg:justify-end">
          <div className="absolute inset-0 scale-90 rotate-3 rounded-[3rem] bg-gradient-to-tr from-primary/30 to-rose-500/30 blur-3xl" />
          <div className="group relative w-full max-w-[500px] overflow-hidden rounded-2xl border border-stone-200 shadow-2xl dark:border-border-dark aspect-[4/5] min-h-[420px]">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
              alt="SoleilRoute destination"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">
                    {t.hero.trustTitle}
                  </h3>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-orange-500/30">
                    <span className="material-symbols-outlined text-[20px]">
                      sunny
                    </span>
                  </span>
                </div>
                <ul className="flex flex-col gap-3">
                  {t.hero.trustBullets.map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/90">
                      <span className="material-symbols-outlined filled-icon text-[20px] text-primary">
                        check_circle
                      </span>
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="my-1 h-px w-full bg-white/20" />
                <p className="flex items-center gap-1 text-xs font-medium text-white/70">
                  <span className="material-symbols-outlined text-[16px]">
                    credit_card_off
                  </span>
                  {t.hero.noCreditCard}
                </p>
              </div>
            </div>
            <div className="absolute right-6 top-6">
              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 backdrop-blur-md">
                <span className="material-symbols-outlined text-[16px] text-white">
                  location_on
                </span>
                <span className="text-xs font-bold text-white">
                  Grand Canyon, USA
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -right-4 top-20 hidden lg:block animate-bounce [animation-duration:3s]">
            <div className="flex items-center gap-3 rounded-lg border border-orange-100 bg-white p-3 pr-5 shadow-xl dark:border-border-dark dark:bg-surface-dark">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500 dark:bg-orange-900/30">
                <span className="material-symbols-outlined">currency_exchange</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  Exchange Rate
                </span>
                <span className="text-sm font-bold text-stone-900 dark:text-white">
                  1 USD = 0.92 EUR
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
