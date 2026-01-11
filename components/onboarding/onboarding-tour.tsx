"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Route } from "next";
import { Button } from "@/components/ui/button";
import { useAppSession, useTranslations } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

type TourStep = {
  id: string;
  title: string;
  body: string;
  selector?: string;
  route?: string;
};

const storageKeyPrefix = "soleilroute:onboarding:v1";
const tooltipWidth = 320;
const tooltipHeight = 220;
const overlayPadding = 12;

export function OnboardingTour() {
  const t = useTranslations();
  const { session } = useAppSession();
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const storageKey = useMemo(() => {
    const userId = session?.user.id;
    return userId ? `${storageKeyPrefix}:${userId}` : storageKeyPrefix;
  }, [session?.user.id]);

  const steps = useMemo<TourStep[]>(
    () => [
      {
        id: "welcome",
        title: t.onboarding.steps.welcome.title,
        body: t.onboarding.steps.welcome.body,
        route: "/dashboard",
      },
      {
        id: "plan-trip",
        title: t.onboarding.steps.planTrip.title,
        body: t.onboarding.steps.planTrip.body,
        selector: '[data-tour="quick-plan-trip"]',
        route: "/dashboard",
      },
      {
        id: "trips",
        title: t.onboarding.steps.trips.title,
        body: t.onboarding.steps.trips.body,
        selector: '[data-tour="nav-trips"]',
        route: "/dashboard/trips",
      },
      {
        id: "budget",
        title: t.onboarding.steps.budget.title,
        body: t.onboarding.steps.budget.body,
        selector: '[data-tour="nav-budgetPlanner"]',
        route: "/dashboard/budget",
      },
      {
        id: "visa",
        title: t.onboarding.steps.visa.title,
        body: t.onboarding.steps.visa.body,
        selector: '[data-tour="nav-visaChecker"]',
        route: "/dashboard/visa",
      },
      {
        id: "notifications",
        title: t.onboarding.steps.notifications.title,
        body: t.onboarding.steps.notifications.body,
        selector: '[data-tour="header-notifications"]',
        route: "/dashboard",
      },
      {
        id: "settings",
        title: t.onboarding.steps.settings.title,
        body: t.onboarding.steps.settings.body,
        selector: '[data-tour="header-profile"]',
        route: "/dashboard",
      },
    ],
    [t],
  );

  const completeTour = useCallback(() => {
    setOpen(false);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "done");
    }
  }, [storageKey]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!session?.user.id) return;
    const params = new URLSearchParams(window.location.search);
    const force = params.get("tour") === "1";
    const completed = window.localStorage.getItem(storageKey) === "done";
    if (force || !completed) {
      setStepIndex(0);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [session?.user.id, storageKey]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!open) return;
    const step = steps[stepIndex];
    if (step.route && !pathname.startsWith(step.route)) {
      router.push(step.route as Route);
    }
  }, [open, pathname, router, stepIndex, steps]);

  useEffect(() => {
    if (!open) return;

    const updateRect = () => {
      const step = steps[stepIndex];
      if (!step.selector) {
        setAnchorRect(null);
        return;
      }
      const element = document.querySelector(step.selector);
      if (!element) {
        setAnchorRect(null);
        return;
      }
      setAnchorRect(element.getBoundingClientRect());
    };

    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [open, stepIndex, steps]);

  useEffect(() => {
    if (!open) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        completeTour();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open, completeTour]);

  const totalSteps = steps.length;
  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;

  const goNext = () => {
    if (isLast) {
      completeTour();
      return;
    }
    setStepIndex((current) => Math.min(current + 1, totalSteps - 1));
  };

  const goBack = () => {
    if (isFirst) return;
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  if (!open) {
    return null;
  }

  const tooltipStyle: CSSProperties = anchorRect
    ? {
        left: Math.min(
          Math.max(anchorRect.left, overlayPadding),
          window.innerWidth - tooltipWidth - overlayPadding,
        ),
        top:
          anchorRect.bottom + overlayPadding + tooltipHeight >
          window.innerHeight
            ? Math.max(anchorRect.top - tooltipHeight - overlayPadding, overlayPadding)
            : anchorRect.bottom + overlayPadding,
      }
    : {
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
      };

  return (
    <div className="fixed inset-0 z-[100]">
      {anchorRect ? (
        <div
          className="pointer-events-none absolute rounded-2xl ring-2 ring-accent/70"
          style={{
            top: anchorRect.top - overlayPadding,
            left: anchorRect.left - overlayPadding,
            width: anchorRect.width + overlayPadding * 2,
            height: anchorRect.height + overlayPadding * 2,
            boxShadow: "0 0 0 9999px rgba(15, 23, 42, 0.45)",
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-950/50" />
      )}
      <div
        className={cn(
          "pointer-events-auto absolute w-[320px] rounded-2xl border border-border/70 bg-background p-4 shadow-xl",
          !anchorRect && "max-w-[90vw]",
        )}
        style={tooltipStyle}
        role="dialog"
        aria-modal="true"
      >
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {t.onboarding.stepLabel(stepIndex + 1, totalSteps)}
        </div>
        <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
        {!anchorRect ? (
          <p className="mt-3 text-xs text-muted-foreground">
            {t.onboarding.loadingHint}
          </p>
        ) : null}
        <div className="mt-4 flex items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={completeTour}>
            {t.onboarding.skip}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={isFirst}
            >
              {t.onboarding.back}
            </Button>
            <Button size="sm" onClick={goNext}>
              {isLast ? t.onboarding.done : t.onboarding.next}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
