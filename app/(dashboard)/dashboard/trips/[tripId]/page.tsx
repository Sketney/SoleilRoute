import { notFound, redirect } from "next/navigation";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarRange, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { budgetCategories, type BudgetCategoryId } from "@/lib/constants";
import { getServerSession } from "@/lib/auth/session";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n";
import {
  canEditTrip,
  getTripAccess,
  getUserById,
  listInvitationsByTrip,
  listBudgetCaps,
  listBudgetItems,
  listTimelineItems,
  listTripCollaborators,
} from "@/server/db";
import { TripDetailsEditor } from "@/components/dashboard/trip-details-editor";
import { BudgetCapsEditor } from "@/components/dashboard/budget-caps-editor";
import { TimelinePlanner } from "@/components/dashboard/timeline-planner";
import { CollaboratorsManager } from "@/components/dashboard/collaborators-manager";

export const metadata = {
  title: "Trip overview",
};

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  const { tripId } = await params;
  if (!tripId) {
    notFound();
  }

  const access = getTripAccess(tripId, session.user.id);

  if (!access) {
    notFound();
  }

  const trip = access.trip;
  const canEdit = canEditTrip(access.role);
  const canManage = access.role === "owner";

  const budgetItems = listBudgetItems(trip.id);
  const paidAmount = budgetItems
    .filter((item) => item.is_paid)
    .reduce((acc, item) => acc + item.amount, 0);
  const plannedByCategory = budgetCategories.reduce(
    (acc, category) => {
      acc[category.id] = 0;
      return acc;
    },
    {} as Record<BudgetCategoryId, number>,
  );
  budgetItems.forEach((item) => {
    const key = (item.category as BudgetCategoryId) ?? "other";
    plannedByCategory[key] = (plannedByCategory[key] ?? 0) + item.amount;
  });

  const caps = listBudgetCaps(trip.id).map((cap) => ({
    id: cap.id,
    category: cap.category as BudgetCategoryId,
    limit: cap.limit_amount,
    currency: cap.currency,
  }));
  const timelineItems = listTimelineItems(trip.id).map((item) => ({
    id: item.id,
    title: item.title,
    dueDate: item.due_date,
    type: item.type,
    status: item.status,
    notes: item.notes ?? null,
    amount: item.amount ?? null,
    currency: item.currency ?? null,
  }));
  const owner = getUserById(trip.user_id);
  const collaborators = listTripCollaborators(trip.id);
  const pendingInvites = listInvitationsByTrip(trip.id)
    .filter((invite) => invite.status === "pending")
    .map((invite) => {
      const invitee = getUserById(invite.invitee_user_id);
      return {
        id: invite.id,
        email: invitee?.email ?? invite.invitee_email,
        role: invite.role,
        createdAt: invite.created_at,
      };
    });
  const collaboratorsList = [
    {
      id: "owner",
      userId: trip.user_id,
      email: owner?.email ?? t.tripOverview.ownerFallback,
      role: "owner" as const,
      addedAt: trip.created_at,
    },
    ...collaborators.map((entry) => {
      const user = getUserById(entry.user_id);
      return {
        id: entry.id,
        userId: entry.user_id,
        email: user?.email ?? t.tripOverview.collaboratorUnknown,
        role: entry.role,
        addedAt: entry.created_at,
      };
    }),
  ];

  const editorValues = {
    name: trip.name,
    destinationCountry: trip.destination_country,
    destinationCity: trip.destination_city,
    startDate: trip.start_date,
    endDate: trip.end_date,
    totalBudget: trip.total_budget,
    travelStyle: trip.budget_tier ?? "mid",
    currency: trip.currency,
    citizenship: trip.citizenship,
    baseCurrency: trip.base_currency,
    notes: trip.notes ?? null,
  };
  const visaLabel = t.visa.statuses[trip.visa_status ?? "unknown"];

  return (
    <section className="space-y-6">
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
                {trip.destination_city}, {trip.destination_country}
              </span>
              {access.role !== "owner" ? (
                <Badge variant="secondary">
                  {access.role === "editor"
                    ? t.tripOverview.sharedEditor
                    : t.tripOverview.sharedViewer}
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
        <TripDetailsEditor
          tripId={trip.id}
          initialValues={editorValues}
          readOnly={!canEdit}
        />
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.tripOverview.detailsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Detail
            icon={<CalendarRange className="h-4 w-4" />}
            label={t.tripOverview.detailLabels.dates}
            value={formatDateRange(trip.start_date, trip.end_date)}
          />
          <Detail
            icon={<MapPin className="h-4 w-4" />}
            label={t.tripOverview.detailLabels.destination}
            value={`${trip.destination_city}, ${trip.destination_country}`}
          />
          <Detail
            label={t.tripOverview.detailLabels.citizenship}
            value={trip.citizenship}
          />
          <Detail
            label={t.tripOverview.detailLabels.totalBudget}
            value={formatCurrency(trip.total_budget, trip.currency)}
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
            value={trip.base_currency}
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

      <BudgetCapsEditor
        tripId={trip.id}
        currency={trip.currency}
        caps={caps}
        plannedByCategory={plannedByCategory}
        readOnly={!canEdit}
      />

      <TimelinePlanner
        tripId={trip.id}
        currency={trip.currency}
        items={timelineItems}
        readOnly={!canEdit}
      />

      <CollaboratorsManager
        tripId={trip.id}
        collaborators={collaboratorsList}
        pendingInvites={pendingInvites}
        currentUserId={session.user.id}
        canManage={canManage}
      />
    </section>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
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
