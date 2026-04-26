"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { TripPlanSnapshot } from "@/lib/services/full-plan/types";

type VisaScenarioOption = Pick<
  TripPlanSnapshot["visaScenarios"][number],
  "id" | "label" | "isDefault"
>;

export function getScenarioKindLabel(scenario: VisaScenarioOption) {
  const haystack = `${scenario.id} ${scenario.label}`.toLowerCase();

  if (haystack.includes("digital-nomad") || haystack.includes("digital nomad")) {
    return "Digital nomad";
  }
  if (haystack.includes("business")) {
    return "Business";
  }
  if (haystack.includes("student")) {
    return "Student";
  }
  if (haystack.includes("family")) {
    return "Family visit";
  }
  if (haystack.includes("holiday")) {
    return "Working holiday";
  }
  if (haystack.includes("tourist") || haystack.includes("short stay")) {
    return "Tourist";
  }
  if (scenario.id === "default") {
    return "Entry requirements";
  }

  return scenario.isDefault ? "Default scenario" : "Alternate scenario";
}

export function getActiveVisaScenario(
  scenarios: VisaScenarioOption[],
  activeScenarioId: string | null,
) {
  if (activeScenarioId) {
    const activeScenario = scenarios.find((scenario) => scenario.id === activeScenarioId);
    if (activeScenario) {
      return activeScenario;
    }
  }

  return scenarios[0] ?? null;
}

export function isVisaScenarioSelectionEnabled({
  editable,
  scenarios,
  isPending,
}: {
  editable: boolean;
  scenarios: VisaScenarioOption[];
  isPending: boolean;
}) {
  return editable && scenarios.length > 1 && !isPending;
}

export function TripPlanVisaScenarios({
  tripId,
  scenarios,
  activeScenarioId,
  editable,
}: {
  tripId: string;
  scenarios: TripPlanSnapshot["visaScenarios"];
  activeScenarioId: string | null;
  editable: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const activeScenario = useMemo(
    () => getActiveVisaScenario(scenarios, activeScenarioId),
    [activeScenarioId, scenarios],
  );
  const activeIndex = activeScenario
    ? scenarios.findIndex((scenario) => scenario.id === activeScenario.id)
    : -1;
  const resolvedIndex = activeIndex >= 0 ? activeIndex : 0;
  const canNavigate = isVisaScenarioSelectionEnabled({
    editable,
    scenarios,
    isPending,
  });

  const selectScenario = async (offset: number) => {
    if (!canNavigate || isPending || !activeScenario) {
      return;
    }

    const nextIndex = (resolvedIndex + offset + scenarios.length) % scenarios.length;
    const nextScenario = scenarios[nextIndex];
    if (!nextScenario || nextScenario.id === activeScenario.id) {
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`/api/trips/${tripId}/plan/visa-scenario`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenarioId: nextScenario.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to save visa scenario");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Visa scenario not saved",
        description: "We could not update the saved visa scenario.",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  };

  if (!activeScenario) {
    return null;
  }

  return (
    <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs uppercase text-muted-foreground">Visa scenario</p>
          <div className="mt-1 flex min-w-0 items-center gap-2">
            <p className="truncate text-sm font-semibold">{activeScenario.label}</p>
            <Badge variant="outline" className="shrink-0">
              {getScenarioKindLabel(activeScenario)}
            </Badge>
          </div>
        </div>
        {canNavigate ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => selectScenario(-1)}
              disabled={isPending}
              aria-label="Show previous visa scenario"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => selectScenario(1)}
              disabled={isPending}
              aria-label="Show next visa scenario"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : scenarios.length > 1 ? (
          <Badge variant="outline" className="shrink-0">
            Read only
          </Badge>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {scenarios.length > 1
          ? editable
            ? isPending
              ? "Saving selection..."
              : `${resolvedIndex + 1} of ${scenarios.length} saved scenarios`
            : `${scenarios.length} saved scenarios available`
          : "Single saved scenario"}
      </p>
    </div>
  );
}
