import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
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
import { TripOverviewSummary } from "@/components/dashboard/trip-overview-summary";
import { BudgetCapsEditor } from "@/components/dashboard/budget-caps-editor";
import { TimelinePlanner } from "@/components/dashboard/timeline-planner";
import { CollaboratorsManager } from "@/components/dashboard/collaborators-manager";
import { hasTripPlanAccessForUser } from "@/lib/services/entitlements";

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

  const access = await getTripAccess(tripId, session.user.id);

  if (!access) {
    notFound();
  }

  const trip = access.trip;
  const canEdit = canEditTrip(access.role);
  const canManage = access.role === "owner";
  const hasPlanAccess = await hasTripPlanAccessForUser(session.user, trip.id);

  const budgetItems = await listBudgetItems(trip.id);
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

  const caps = (await listBudgetCaps(trip.id)).map((cap) => ({
    id: cap.id,
    category: cap.category as BudgetCategoryId,
    limit: cap.limit_amount,
    currency: cap.currency,
  }));
  const timelineItems = (await listTimelineItems(trip.id)).map((item) => ({
    id: item.id,
    title: item.title,
    dueDate: item.due_date,
    type: item.type,
    status: item.status,
    notes: item.notes ?? null,
    amount: item.amount ?? null,
    currency: item.currency ?? null,
  }));
  const owner = await getUserById(trip.user_id);
  const collaborators = await listTripCollaborators(trip.id);
  const pendingInvites = await Promise.all(
    (await listInvitationsByTrip(trip.id))
      .filter((invite) => invite.status === "pending")
      .map(async (invite) => {
        const invitee = await getUserById(invite.invitee_user_id);
        return {
          id: invite.id,
          email: invitee?.email ?? invite.invitee_email,
          role: invite.role,
          createdAt: invite.created_at,
        };
      }),
  );
  const collaboratorsList = [
    {
      id: "owner",
      userId: trip.user_id,
      email: owner?.email ?? t.tripOverview.ownerFallback,
      role: "owner" as const,
      addedAt: trip.created_at,
    },
    ...(await Promise.all(
      collaborators.map(async (entry) => {
        const user = await getUserById(entry.user_id);
        return {
          id: entry.id,
          userId: entry.user_id,
          email: user?.email ?? t.tripOverview.collaboratorUnknown,
          role: entry.role,
          addedAt: entry.created_at,
        };
      }),
    )),
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
  return (
    <section className="space-y-6">
      <TripOverviewSummary
        tripId={trip.id}
        role={access.role}
        canEdit={canEdit}
        hasPlanAccess={hasPlanAccess}
        paidAmount={paidAmount}
        initialTrip={{
          ...editorValues,
          visaStatus: trip.visa_status ?? "unknown",
        }}
      />

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
