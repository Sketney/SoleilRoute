"use client";

import { CalendarRange, CreditCard, Globe2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "@/components/providers/app-providers";

export function FeaturesGrid() {
  const t = useTranslations();
  const icons = [Globe2, CreditCard, CalendarRange, Users];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-background-dark py-20 text-white"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-rose-500/10 blur-[128px]" />
      </div>
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            {t.features.heading}
          </h2>
          <p className="text-lg text-stone-400">
            {t.features.subheading}
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {t.features.items.map((feature, index) => {
          const Icon = icons[index] ?? Globe2;
          return (
            <Card
              key={feature.title}
              className="group flex h-full flex-col border border-white/10 bg-white/5 text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:bg-white/[0.07] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
            >
              <CardHeader className="space-y-5">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-400 transition-colors group-hover:text-slate-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>
    </section>
  );
}
