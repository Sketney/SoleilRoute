"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import type {
  TripPlanSnapshot,
  PlanDocument,
  PlanTimelineItem,
} from "@/lib/services/full-plan/types";
import { TripPlanVisaScenarios } from "@/components/dashboard/trip-plan-visa-scenarios";
import { VisaIssueReport } from "@/components/dashboard/visa-issue-report";

export type TripPlanScenarioViewState = Pick<
  TripPlanSnapshot,
  "activeVisaScenarioId" | "visa" | "documents" | "timeline" | "reminders"
>;

export function buildTripPlanScenarioViewState(
  plan: TripPlanSnapshot,
): TripPlanScenarioViewState {
  return {
    activeVisaScenarioId: plan.activeVisaScenarioId,
    visa: plan.visa,
    documents: plan.documents,
    timeline: plan.timeline,
    reminders: plan.reminders,
  };
}

export function applyVisaScenarioSelectionResponse(
  plan: TripPlanScenarioViewState,
  response: TripPlanScenarioViewState,
): TripPlanScenarioViewState {
  return {
    ...plan,
    activeVisaScenarioId: response.activeVisaScenarioId,
    visa: response.visa,
    documents: response.documents,
    timeline: response.timeline,
    reminders: response.reminders,
  };
}

export function TripPlanScenarioSections({
  tripId,
  plan,
  editable,
  locked,
}: {
  tripId: string;
  plan: TripPlanSnapshot;
  editable: boolean;
  locked: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [scenarioView, setScenarioView] = useState<TripPlanScenarioViewState>(
    buildTripPlanScenarioViewState(plan),
  );

  useEffect(() => {
    setScenarioView(buildTripPlanScenarioViewState(plan));
  }, [plan]);

  const selectScenario = async (scenarioId: string) => {
    if (isPending) {
      return;
    }

    setIsPending(true);

    try {
      const response = await fetch(`/api/trips/${tripId}/plan/visa-scenario`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scenarioId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save visa scenario");
      }

      const payload = (await response.json()) as TripPlanScenarioViewState;
      setScenarioView((current) =>
        applyVisaScenarioSelectionResponse(current, payload),
      );
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

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Visa"
          value={
            scenarioView.visa.required === null
              ? "Unknown"
              : scenarioView.visa.required
                ? "Required"
                : "Not required"
          }
        />
        <SummaryCard
          icon={<FileText className="h-4 w-4" />}
          label="Documents"
          value={`${scenarioView.documents.length} items`}
        />
        <SummaryCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="Timeline"
          value={`${scenarioView.timeline.length} milestones`}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70">
          <CardHeader className="space-y-4">
            <TripPlanVisaScenarios
              scenarios={plan.visaScenarios}
              activeScenarioId={scenarioView.activeVisaScenarioId}
              editable={editable}
              isPending={isPending}
              onSelectScenario={selectScenario}
            />
            <CardTitle>Visa snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Detail label="Type" value={scenarioView.visa.type ?? "Not available"} />
            <Detail label="Validity" value={scenarioView.visa.validity ?? "Check official source"} />
            <Detail label="Processing" value={scenarioView.visa.processingTime ?? "Check official source"} />
            <Detail
              label="Passport validity"
              value={scenarioView.visa.passportValidity ?? "Check official source"}
            />
            <Detail
              label="Source"
              value={`${scenarioView.visa.source}${
                scenarioView.visa.checkedAt
                  ? ` - ${new Date(scenarioView.visa.checkedAt).toLocaleDateString()}`
                  : ""
              }`}
            />
            {scenarioView.visa.notes ? (
              <p className="rounded-lg border border-border/60 bg-muted/30 p-3 text-muted-foreground">
                {scenarioView.visa.notes}
              </p>
            ) : null}
            <VisaIssueReport
              tripId={tripId}
              citizenship={plan.trip.citizenship}
              destination={plan.trip.destination}
            />
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Sources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {plan.sources.map((source) => (
              <div key={source.label} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{source.label}</p>
                  <Badge variant={source.confidence === "high" ? "success" : "secondary"}>
                    {source.confidence}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {source.source}
                  {source.checkedAt ? ` - ${new Date(source.checkedAt).toLocaleString()}` : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChecklistSection
          title="Documents"
          locked={locked}
          items={locked ? scenarioView.documents.slice(0, 4) : scenarioView.documents}
        />
        <TimelineSection
          title="Timeline"
          locked={locked}
          items={locked ? scenarioView.timeline.slice(0, 4) : scenarioView.timeline}
        />
      </div>
    </>
  );
}

function SummaryCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border/70">
      <CardContent className="flex items-center gap-3 p-4">
        <span className="rounded-md bg-muted p-2 text-muted-foreground">{icon}</span>
        <div>
          <p className="text-xs uppercase text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function ChecklistSection({
  title,
  items,
  locked,
}: {
  title: string;
  items: PlanDocument[];
  locked: boolean;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {locked ? <Badge variant="warning">Preview</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3 rounded-lg border border-border/60 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TimelineSection({
  title,
  items,
  locked,
}: {
  title: string;
  items: PlanTimelineItem[];
  locked: boolean;
}) {
  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {locked ? <Badge variant="warning">Preview</Badge> : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-border/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">{item.title}</p>
              {item.urgent ? <Badge variant="danger">Urgent</Badge> : null}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(item.dueDate).toLocaleDateString()} - {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
