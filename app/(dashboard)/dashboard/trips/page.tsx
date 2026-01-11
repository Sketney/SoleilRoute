import { redirect } from "next/navigation";
import { type DashboardTrip } from "@/components/dashboard/trip-list";
import { TripsView } from "@/components/dashboard/trips-view";
import { getServerSession } from "@/lib/auth/session";
import { listBudgetItems, listTripsWithAccess } from "@/server/db";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n";

export const metadata = {
  title: "Trips",
};

export default async function TripsPage() {
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

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{t.navigation.trips}</h1>
        <p className="text-sm text-muted-foreground">
          {t.tripsView.pageDescription}
        </p>
      </div>
      <TripsView trips={dashboardTrips} />
    </section>
  );
}
