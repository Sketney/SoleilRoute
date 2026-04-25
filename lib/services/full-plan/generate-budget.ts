import type { BudgetItemRecord, TripRecord } from "@/server/db/trips";
import type { PlanBudgetItem } from "@/lib/services/full-plan/types";
import { splitBudgetByTier } from "@/lib/budget";

export function generateBudgetSnapshot({
  trip,
  budgetItems,
}: {
  trip: TripRecord;
  budgetItems: BudgetItemRecord[];
}) {
  const sourceItems =
    budgetItems.length > 0
      ? budgetItems.map<PlanBudgetItem>((item) => ({
          category: item.category as PlanBudgetItem["category"],
          amount: item.amount,
          currency: item.currency,
          source: "user_input",
          confidence: "high",
          editable: true,
        }))
      : splitBudgetByTier(trip.total_budget, trip.budget_tier ?? "mid").map<PlanBudgetItem>(
          (item) => ({
            category: item.category,
            amount: item.amount,
            currency: trip.currency,
            source: "generated_estimate",
            confidence: "medium",
            editable: true,
          }),
        );

  return {
    total: sourceItems.reduce((sum, item) => sum + item.amount, 0),
    currency: trip.currency,
    items: sourceItems,
  };
}
