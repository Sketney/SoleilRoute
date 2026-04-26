import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Download,
  FileText,
  Lock,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";
import { hasTripPlanAccessForUser } from "@/lib/services/entitlements";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";
import { getVisaRequirement } from "@/lib/services/visa";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import {
  canEditTrip,
  getTripAccess,
  getTripPlan,
  listBudgetItems,
} from "@/server/db";
import { TripPlanVisaScenarios } from "@/components/dashboard/trip-plan-visa-scenarios";
import { TripPlanUnlockButton } from "@/components/dashboard/trip-plan-unlock";
import { VisaIssueReport } from "@/components/dashboard/visa-issue-report";
import type { TripPlanSnapshot } from "@/lib/services/full-plan/types";

export const metadata = {
  title: "Full trip plan",
};

export default async function TripPlanPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    notFound();
  }

  const hasAccess = await hasTripPlanAccessForUser(session.user, access.trip.id);
  const canPersistVisaScenario = hasAccess && canEditTrip(access.role);
  const storedPlan = hasAccess ? await getTripPlan(access.trip.id) : null;
  const plan =
    storedPlan?.status === "full"
      ? storedPlan.plan_json
      : await buildPreviewPlan(access.trip.id);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/dashboard/trips/${access.trip.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Trip overview
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">Full trip plan</h1>
            <p className="text-sm text-muted-foreground">
              {plan.trip.destination} ·{" "}
              {formatDateRange(plan.trip.dates.start, plan.trip.dates.end)}
            </p>
          </div>
        </div>
        <TripPlanUnlockButton tripId={access.trip.id} locked={!hasAccess} />
      </div>

      {!hasAccess ? <LockedPlanBanner tripId={access.trip.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={<ShieldCheck className="h-4 w-4" />}
          label="Visa"
          value={plan.visa.required === null ? "Unknown" : plan.visa.required ? "Required" : "Not required"}
        />
        <SummaryCard
          icon={<FileText className="h-4 w-4" />}
          label="Documents"
          value={`${plan.documents.length} items`}
        />
        <SummaryCard
          icon={<CalendarClock className="h-4 w-4" />}
          label="Timeline"
          value={`${plan.timeline.length} milestones`}
        />
        <SummaryCard
          icon={<WalletCards className="h-4 w-4" />}
          label="Budget"
          value={formatCurrency(plan.budget.total, plan.budget.currency)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-border/70">
          <CardHeader className="space-y-4">
            <TripPlanVisaScenarios
              tripId={access.trip.id}
              scenarios={plan.visaScenarios}
              activeScenarioId={plan.activeVisaScenarioId}
              editable={canPersistVisaScenario}
            />
            <CardTitle>Visa snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Detail label="Type" value={plan.visa.type ?? "Not available"} />
            <Detail label="Validity" value={plan.visa.validity ?? "Check official source"} />
            <Detail label="Processing" value={plan.visa.processingTime ?? "Check official source"} />
            <Detail label="Passport validity" value={plan.visa.passportValidity ?? "Check official source"} />
            <Detail label="Source" value={`${plan.visa.source}${plan.visa.checkedAt ? ` · ${new Date(plan.visa.checkedAt).toLocaleDateString()}` : ""}`} />
            {plan.visa.notes ? (
              <p className="rounded-lg border border-border/60 bg-muted/30 p-3 text-muted-foreground">
                {plan.visa.notes}
              </p>
            ) : null}
            <VisaIssueReport
              tripId={access.trip.id}
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
                  {source.checkedAt ? ` · ${new Date(source.checkedAt).toLocaleString()}` : ""}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChecklistSection
          title="Documents"
          locked={!hasAccess}
          items={hasAccess ? plan.documents : plan.documents.slice(0, 4)}
        />
        <TimelineSection
          title="Timeline"
          locked={!hasAccess}
          items={hasAccess ? plan.timeline : plan.timeline.slice(0, 4)}
        />
      </div>

      <Card className="border-border/70">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Budget snapshot</CardTitle>
          <Badge variant="outline">Snapshot</Badge>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {plan.budget.items.map((item) => (
            <div key={item.category} className="rounded-lg border border-border/60 p-3">
              <p className="text-xs uppercase text-muted-foreground">{item.category.replace("_", " ")}</p>
              <p className="text-sm font-semibold">
                {formatCurrency(item.amount, item.currency)}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.source} · {item.confidence}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>Export</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            PDF export will use this saved plan snapshot and requires plan access.
          </p>
          {hasAccess ? (
            <Button asChild variant="outline">
              <a href={`/api/trips/${access.trip.id}/export`}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Unlock to export
            </Button>
          )}
        </CardContent>
      </Card>

      <p className="rounded-lg border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
        {plan.disclaimer}
      </p>
    </section>
  );
}

async function buildPreviewPlan(tripId: string): Promise<TripPlanSnapshot> {
  const accessTrip = await getTripAccessForPreview(tripId);
  const [visa, budgetItems] = await Promise.all([
    getVisaRequirement(accessTrip.citizenship, accessTrip.destination_country).catch(
      () => null,
    ),
    listBudgetItems(accessTrip.id),
  ]);
  return buildPlanSnapshot({
    trip: accessTrip,
    visa,
    budgetItems,
    reason: "manual_regenerate",
  });
}

async function getTripAccessForPreview(tripId: string) {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    notFound();
  }
  return access.trip;
}

function LockedPlanBanner({ tripId }: { tripId: string }) {
  return (
    <Card className="border-amber-300/70 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-100">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <Lock className="mt-0.5 h-5 w-5" />
          <div>
            <p className="font-semibold">Full trip plan is locked</p>
            <p className="text-sm opacity-85">
              Unlock for mock Trip Pass access. Includes complete documents,
              timeline, budget snapshot, reminders, sources, and future PDF export.
            </p>
          </div>
        </div>
        <TripPlanUnlockButton tripId={tripId} locked />
      </CardContent>
    </Card>
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
  items: TripPlanSnapshot["documents"];
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
  items: TripPlanSnapshot["timeline"];
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
              {new Date(item.dueDate).toLocaleDateString()} · {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
