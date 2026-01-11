import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type BudgetCategoryId } from "@/lib/constants";
import { getServerSession } from "@/lib/auth/session";
import { canEditTrip, getTripAccess, listBudgetItems } from "@/server/db";
import { TripBudgetManager } from "@/components/dashboard/trip-budget-manager";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n";

export const metadata = {
  title: "Trip budget",
};

export default async function TripBudgetPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  if (!tripId) {
    notFound();
  }

  const access = await getTripAccess(tripId, session.user.id);

  if (!access) {
    notFound();
  }
  const trip = access.trip;
  const canEdit = canEditTrip(access.role);

  const budgetItems = (await listBudgetItems(trip.id)).map((item) => ({
    id: item.id,
    category: item.category as BudgetCategoryId,
    description: item.description,
    amount: item.amount,
    currency: item.currency,
    isPaid: Boolean(item.is_paid),
  }));

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="sm" variant="ghost">
          <Link href={`/dashboard/trips/${trip.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.tripBudgetPage.backToOverview}
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{t.tripBudgetPage.title}</h1>
          <p className="text-sm text-muted-foreground">{trip.name}</p>
        </div>
      </div>
      <TripBudgetManager
        tripId={trip.id}
        currency={trip.currency}
        totalBudget={trip.total_budget}
        items={budgetItems}
        readOnly={!canEdit}
      />
    </section>
  );
}
