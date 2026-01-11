import { redirect } from "next/navigation";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatCards } from "@/components/dashboard/stat-cards";
import {
  TripList,
  type DashboardTrip,
} from "@/components/dashboard/trip-list";
import {
  BudgetChart,
  type BudgetItemSummary,
} from "@/components/dashboard/budget-chart";
import { VisaChecker } from "@/components/dashboard/visa-checker";
import { getServerSession } from "@/lib/auth/session";
import { budgetCategories } from "@/lib/constants";
import { splitBudgetByTier } from "@/lib/budget";
import { listBudgetItems, listTripsWithAccess } from "@/server/db";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  const tripsWithAccess = await listTripsWithAccess(session.user.id);
  const trips = tripsWithAccess.map((entry) => entry.trip);
  const budgetItems = (
    await Promise.all(trips.map((trip) => listBudgetItems(trip.id)))
  ).flat();
  const plannedByTrip = budgetItems.reduce((acc, item) => {
    const current = acc.get(item.trip_id) ?? 0;
    acc.set(item.trip_id, current + (item.amount ?? 0));
    return acc;
  }, new Map<string, number>());

  const totalBudget = trips.reduce(
    (acc, trip) => acc + (trip.total_budget ?? 0),
    0,
  );

  const paidAmount = budgetItems.reduce(
    (acc, item) => acc + (item.is_paid ? item.amount ?? 0 : 0),
    0,
  );

  const upcomingTrips = trips.filter((trip) =>
    isWithinNextDays(trip.start_date, 30),
  );
  const overBudgetTrips = trips.filter((trip) => {
    const planned = plannedByTrip.get(trip.id) ?? 0;
    return planned > (trip.total_budget ?? 0);
  });

  const stats = [
    {
      label: t.dashboardOverview.stats.totalBudgetLabel,
      value: totalBudget,
      currency: trips[0]?.currency ?? "USD",
      helper: t.dashboardOverview.stats.totalBudgetHelper,
    },
    {
      label: t.dashboardOverview.stats.activeTripsLabel,
      value: trips.length,
      helper: t.dashboardOverview.stats.activeTripsHelper,
    },
    {
      label: t.dashboardOverview.stats.paidInvoicesLabel,
      value: paidAmount,
      currency: trips[0]?.currency ?? "USD",
      helper: t.dashboardOverview.stats.paidInvoicesHelper,
    },
    {
      label: t.dashboardOverview.stats.outstandingLabel,
      value: Math.max(totalBudget - paidAmount, 0),
      currency: trips[0]?.currency ?? "USD",
      helper: t.dashboardOverview.stats.outstandingHelper,
    },
    {
      label: t.dashboardOverview.stats.upcomingTripsLabel,
      value: upcomingTrips.length,
      helper: t.dashboardOverview.stats.upcomingTripsHelper,
    },
    {
      label: t.dashboardOverview.stats.overBudgetLabel,
      value: overBudgetTrips.length,
      helper: t.dashboardOverview.stats.overBudgetHelper,
    },
  ];

  const dashboardTrips: DashboardTrip[] = tripsWithAccess.map(({ trip, role }) => {
    const budgets = budgetItems.filter((item) => item.trip_id === trip.id);
    const paid = budgets.reduce(
      (acc, item) => acc + (item.is_paid ? item.amount ?? 0 : 0),
      0,
    );
    return {
      id: trip.id,
      name: trip.name,
      destination: {
        country: trip.destination_country,
        city: trip.destination_city,
      },
      startDate: trip.start_date,
      endDate: trip.end_date,
      totalBudget: trip.total_budget,
      currency: trip.currency,
      paidAmount: paid,
      visaStatus: trip.visa_status ?? "unknown",
      role,
    };
  });

  const primaryTrip = dashboardTrips[0];
  const primaryBudgetItems: BudgetItemSummary[] = primaryTrip
    ? aggregateBudgetForTrip(
        primaryTrip.id,
        budgetItems,
        primaryTrip.totalBudget,
      )
    : [];

  return (
    <section className="space-y-6">
      <StatCards stats={stats} />
      <QuickActions />
      {primaryTrip ? (
        <BudgetChart
          items={primaryBudgetItems}
          totalBudget={primaryTrip.totalBudget}
          currency={primaryTrip.currency}
        />
      ) : null}
      <TripList trips={dashboardTrips} />
      <VisaChecker />
    </section>
  );
}

function isWithinNextDays(date: string, days: number) {
  const start = new Date(date);
  if (Number.isNaN(start.getTime())) {
    return false;
  }
  const now = new Date();
  const diffMs = start.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
}
function aggregateBudgetForTrip(
  tripId: string,
  items: Array<{
    trip_id: string;
    category: string;
    amount: number;
    is_paid: boolean;
  }>,
  totalBudget: number,
): BudgetItemSummary[] {
  const grouped = new Map<
    string,
    {
      planned: number;
      paid: number;
    }
  >();

  for (const category of budgetCategories) {
    grouped.set(category.id, { planned: 0, paid: 0 });
  }

  const filteredItems = items.filter((item) => item.trip_id === tripId);

  filteredItems.forEach((item) => {
    const key = item.category ?? "other";
    const current = grouped.get(key) ?? { planned: 0, paid: 0 };
    grouped.set(key, {
      planned: current.planned + (item.amount ?? 0),
      paid: current.paid + (item.is_paid ? item.amount ?? 0 : 0),
    });
  });

  if (filteredItems.length === 0) {
    return splitBudgetByTier(totalBudget, "mid").map((item) => ({
      category: item.category,
      planned: item.amount,
      paid: 0,
    }));
  }

  return budgetCategories.map((category) => {
    const entry = grouped.get(category.id) ?? { planned: 0, paid: 0 };
    return {
      category: category.id,
      planned: entry.planned,
      paid: entry.paid,
    };
  });
}
