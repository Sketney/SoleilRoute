import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Lock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TripPlanScenarioSections } from "@/components/dashboard/trip-plan-scenario-sections";
import { TripPlanUnlockButton } from "@/components/dashboard/trip-plan-unlock";
import { getServerSession } from "@/lib/auth/session";
import { hasTripPlanAccessForUser } from "@/lib/services/entitlements";
import { buildPlanSnapshot } from "@/lib/services/full-plan/build-plan-snapshot";
import type { TripPlanSnapshot } from "@/lib/services/full-plan/types";
import { getVisaRequirement } from "@/lib/services/visa";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import {
  canEditTrip,
  getTripAccess,
  getTripPlan,
  listBudgetItems,
} from "@/server/db";

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
              {plan.trip.destination} В·{" "}
              {formatDateRange(plan.trip.dates.start, plan.trip.dates.end)}
            </p>
          </div>
        </div>
        <TripPlanUnlockButton tripId={access.trip.id} locked={!hasAccess} />
      </div>

      {!hasAccess ? <LockedPlanBanner tripId={access.trip.id} /> : null}

      <TripPlanScenarioSections
        tripId={access.trip.id}
        plan={plan}
        editable={canPersistVisaScenario}
        locked={!hasAccess}
      />

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
                {item.source} В· {item.confidence}
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
