"use client";

import { useState } from "react";
import { PlaneTakeoff, ShieldCheck, Wallet, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TripForm } from "@/components/forms/trip-form";
import { useTranslations } from "@/components/providers/app-providers";

export function QuickActions() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  type QuickAction =
    | {
        icon: LucideIcon;
        title: string;
        description: string;
        type: "dialog";
      }
    | {
        icon: LucideIcon;
        title: string;
        description: string;
        type: "link";
        href: string;
      };
  const actions: QuickAction[] = [
    {
      icon: PlaneTakeoff,
      title: t.quickActions.actions.planTripTitle,
      description: t.quickActions.actions.planTripDescription,
      type: "dialog",
    },
    {
      icon: Wallet,
      title: t.quickActions.actions.reviewBudgetsTitle,
      description: t.quickActions.actions.reviewBudgetsDescription,
      type: "link",
      href: "/dashboard/budget",
    },
    {
      icon: ShieldCheck,
      title: t.quickActions.actions.checkVisaTitle,
      description: t.quickActions.actions.checkVisaDescription,
      type: "link",
      href: "/dashboard/visa",
    },
  ];

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{t.quickActions.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          if (action.type === "dialog") {
            return (
              <Dialog key={action.title} open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-full justify-start gap-3 text-left"
                    data-testid="quick-plan-trip"
                    data-tour="quick-plan-trip"
                  >
                    <Icon className="h-4 w-4" />
                    <span>
                      <span className="block text-sm font-semibold">
                        {action.title}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{t.quickActions.dialogTitle}</DialogTitle>
                    <DialogDescription>
                      {t.quickActions.dialogDescription}
                    </DialogDescription>
                  </DialogHeader>
                  <TripForm
                    onSuccess={() => {
                      setOpen(false);
                    }}
                  />
                </DialogContent>
              </Dialog>
            );
          }

          return (
            <Button
              key={action.title}
              variant="outline"
              className="h-full justify-start gap-3 text-left"
              asChild
            >
              <a href={action.href}>
                <Icon className="h-4 w-4" />
                <span>
                  <span className="block text-sm font-semibold">
                    {action.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </span>
              </a>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
