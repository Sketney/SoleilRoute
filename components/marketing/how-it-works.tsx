"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/components/providers/app-providers";

export function HowItWorks() {
  const t = useTranslations();

  return (
    <section id="how-it-works" className="py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.howItWorks.heading}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400">
            {t.howItWorks.subheading}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
        {t.howItWorks.steps.map((step, index) => (
          <Card
            key={step.title}
            className="h-full rounded-xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
          >
            <CardHeader className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {t.howItWorks.stepLabel(index + 1)}
              </div>
              <CardTitle className="text-xl text-stone-900 dark:text-white">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {step.body}
              </p>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>
    </section>
  );
}
