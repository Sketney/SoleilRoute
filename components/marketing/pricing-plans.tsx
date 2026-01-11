"use client";

import { Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useTranslations } from "@/components/providers/app-providers";

export function PricingPlans() {
  const t = useTranslations();
  const planLinks = [siteConfig.cta.primary, siteConfig.cta.primary, "/contact"];

  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.pricing.heading}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400">
            {t.pricing.subheading}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
        {t.pricing.plans.map((plan, index) => {
          const highlighted = index === 1;
          return (
          <Card
            key={plan.name}
            className="flex h-full flex-col rounded-xl border border-stone-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-stone-900 dark:text-white">
                  {plan.name}
                </CardTitle>
                {highlighted && (
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                    {t.pricing.popular}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-stone-900 dark:text-white">
                {plan.price}
                {plan.period && (
                  <span className="text-base font-medium text-stone-500 dark:text-stone-400">
                    {" "}
                    {plan.period}
                  </span>
                )}
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3 text-sm text-stone-600 dark:text-stone-300">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full rounded-lg"
                variant={highlighted ? "default" : "outline"}
                asChild
              >
                <a href={planLinks[index] ?? siteConfig.cta.primary}>
                  {plan.cta}
                </a>
              </Button>
            </CardFooter>
          </Card>
        );
        })}
        </div>
      </div>
    </section>
  );
}
