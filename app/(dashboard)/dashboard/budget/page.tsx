import { redirect } from "next/navigation";
import { BudgetPlanner } from "@/components/dashboard/budget-planner";
import { getServerSession } from "@/lib/auth/session";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n";

export const metadata = {
  title: "Budget planner",
};

export default async function BudgetPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{t.budgetPlanner.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.budgetPlanner.description}
        </p>
      </div>
      <BudgetPlanner />
    </section>
  );
}
