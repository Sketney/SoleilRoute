"use client";

import { useMemo, useState } from "react";
import { BudgetChart, type BudgetItemSummary } from "@/components/dashboard/budget-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BudgetItemsEditor } from "@/components/dashboard/budget-items-editor";
import {
  budgetCategories,
  type BudgetCategoryId,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "@/components/providers/app-providers";

type BudgetItem = {
  id: string;
  category: BudgetCategoryId;
  description: string | null;
  amount: number;
  currency: string;
  isPaid: boolean;
};

type TripBudgetManagerProps = {
  tripId: string;
  currency: string;
  totalBudget: number;
  items: BudgetItem[];
  readOnly?: boolean;
};

export function TripBudgetManager({
  tripId,
  currency,
  totalBudget,
  items,
  readOnly = false,
}: TripBudgetManagerProps) {
  const t = useTranslations();
  const [currentItems, setCurrentItems] = useState<BudgetItem[]>(items);

  const totals = useMemo(() => {
    return currentItems.reduce(
      (acc, item) => {
        const amount = Number(item.amount ?? 0);
        acc.planned += amount;
        if (item.isPaid) {
          acc.paid += amount;
        }
        return acc;
      },
      { planned: 0, paid: 0 },
    );
  }, [currentItems]);
  const progress =
    totalBudget > 0 ? Math.min((totals.paid / totalBudget) * 100, 100) : 0;
  const progressPercent = Math.round(progress);

  const summaries = useMemo<BudgetItemSummary[]>(() => {
    const grouped = new Map<string, { planned: number; paid: number }>();
    budgetCategories.forEach((category) => {
      grouped.set(category.id, { planned: 0, paid: 0 });
    });

    currentItems.forEach((item) => {
      const key = item.category ?? "other";
      const current = grouped.get(key) ?? { planned: 0, paid: 0 };
      grouped.set(key, {
        planned: current.planned + (item.amount ?? 0),
        paid: current.paid + (item.isPaid ? item.amount ?? 0 : 0),
      });
    });

    return budgetCategories.map((category) => {
      const entry = grouped.get(category.id) ?? { planned: 0, paid: 0 };
      return {
        category: category.id,
        planned: entry.planned,
        paid: entry.paid,
      };
    });
  }, [currentItems]);

  return (
    <div className="space-y-6">
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.tripBudget.progressTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap justify-between gap-2 text-sm">
            <span>{t.tripBudget.paidSoFar}</span>
            <span>
              {formatCurrency(totals.paid, currency)} /{" "}
              {formatCurrency(totalBudget, currency)}
            </span>
          </div>
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">
            {t.tripBudget.progressSummary(
              progressPercent,
              formatCurrency(totals.planned, currency),
            )}
          </p>
        </CardContent>
      </Card>
      <BudgetChart
        items={summaries}
        totalBudget={totalBudget}
        currency={currency}
      />
      <BudgetItemsEditor
        tripId={tripId}
        currency={currency}
        totalBudget={totalBudget}
        items={items}
        readOnly={readOnly}
        onItemsChange={setCurrentItems}
      />
    </div>
  );
}
