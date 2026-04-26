"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarRange, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { TripDetailsEditor, type TripDetailsSnapshot } from "@/components/dashboard/trip-details-editor";
import { TripPlanUnlockButton } from "@/components/dashboard/trip-plan-unlock";
import { useTranslations } from "@/components/providers/app-providers";

type TripOverviewSummaryProps = {
  tripId: string;
  role: "owner" | "editor" | "viewer";
  canEdit: boolean;
  hasPlanAccess: boolean;
  paidAmount: number;
  initialTrip: TripDetailsSnapshot;
};

export function TripOverviewSummary({
  tripId,
  role,
  canEdit,
  hasPlanAccess,
  paidAmount,
  initialTrip,
}: TripOverviewSummaryProps) {
  const t = useTranslations();
  const [trip, setTrip] = useState(initialTrip);
  const visaLabel = t.visa.statuses[(trip.visaStatus ?? "unknown") as keyof typeof t.visa.statuses];

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/trips">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t.tripOverview.backToTrips}
            </Link>
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">{trip.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>
                {trip.destinationCity}, {trip.destinationCountry}
              </span>
              {role !== "owner" ? (
                <Badge variant="secondary">
                  {role === "editor"
                    ? t.tripOverview.sharedEditor
                    : t.tripOverview.sharedViewer}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
        <TripDetailsEditor
          tripId={tripId}
          initialValues={trip}
          readOnly={!canEdit}
          onUpdated={setTrip}
        />
        <TripPlanUnlockButton tripId={tripId} locked={!hasPlanAccess} />
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.tripOverview.detailsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Detail
            icon={<CalendarRange className="h-4 w-4" />}
            label={t.tripOverview.detailLabels.dates}
            value={formatDateRange(trip.startDate, trip.endDate)}
          />
          <Detail
            icon={<MapPin className="h-4 w-4" />}
            label={t.tripOverview.detailLabels.destination}
            value={`${trip.destinationCity}, ${trip.destinationCountry}`}
          />
          <Detail
            label={t.tripOverview.detailLabels.citizenship}
            value={trip.citizenship}
          />
          <Detail
            label={t.tripOverview.detailLabels.totalBudget}
            value={formatCurrency(trip.totalBudget, trip.currency)}
          />
          <Detail
            label={t.tripOverview.detailLabels.spentPaid}
            value={formatCurrency(paidAmount, trip.currency)}
          />
          <Detail
            label={t.tripOverview.detailLabels.visaStatus}
            value={visaLabel}
          />
          <Detail
            label={t.tripOverview.detailLabels.baseCurrency}
            value={trip.baseCurrency}
          />
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.tripOverview.notesTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {trip.notes ? (
            <p className="whitespace-pre-line text-sm text-muted-foreground">
              {trip.notes}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t.tripOverview.notesEmpty}
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
      {icon ? <span className="mt-0.5 text-muted-foreground">{icon}</span> : null}
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
