"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  budgetCategories,
  type BudgetCategoryId,
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "@/components/providers/app-providers";

type BudgetCap = {
  id: string;
  category: BudgetCategoryId;
  limit: number;
  currency: string;
};

type BudgetCapsEditorProps = {
  tripId: string;
  currency: string;
  caps: BudgetCap[];
  plannedByCategory: Record<BudgetCategoryId, number>;
  readOnly?: boolean;
};

export function BudgetCapsEditor({
  tripId,
  currency,
  caps,
  plannedByCategory,
  readOnly = false,
}: BudgetCapsEditorProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const [saving, setSaving] = useState(false);

  const capByCategory = useMemo(() => {
    const map = new Map<BudgetCategoryId, BudgetCap>();
    caps.forEach((cap) => {
      map.set(cap.category, cap);
    });
    return map;
  }, [caps]);

  const [values, setValues] = useState<Record<BudgetCategoryId, string>>(() => {
    const initial = {} as Record<BudgetCategoryId, string>;
    budgetCategories.forEach((category) => {
      const cap = capByCategory.get(category.id);
      initial[category.id] = cap ? String(cap.limit) : "";
    });
    return initial;
  });

  const handleSave = async () => {
    if (readOnly) {
      return;
    }
    setSaving(true);
    try {
      const payload = budgetCategories
        .map((category) => ({
          category: category.id,
          value: Number(values[category.id]),
        }))
        .filter(
          (entry) => Number.isFinite(entry.value) && entry.value > 0,
        )
        .map((entry) => ({
          category: entry.category,
          limit: entry.value,
        }));

      const response = await fetch(`/api/trips/${tripId}/budget-caps`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caps: payload }),
      });

      if (!response.ok) {
        throw new Error("Failed to update caps");
      }

      const data = (await response.json()) as { caps: BudgetCap[] };
      const updated = new Map<BudgetCategoryId, BudgetCap>();
      data.caps.forEach((cap) => {
        updated.set(cap.category, cap);
      });
      setValues((current) => {
        const next = { ...current } as Record<BudgetCategoryId, string>;
        budgetCategories.forEach((category) => {
          const cap = updated.get(category.id);
          next[category.id] = cap ? String(cap.limit) : "";
        });
        return next;
      });

      toast({
        title: t.budgetCaps.toastSuccessTitle,
        description: t.budgetCaps.toastSuccessDescription,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: t.budgetCaps.toastErrorTitle,
        description: t.budgetCaps.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-border/70">
      <CardHeader>
        <CardTitle>{t.budgetCaps.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t.budgetCaps.description}
        </p>
        <div className="space-y-4">
          {budgetCategories.map((category) => {
            const planned = plannedByCategory[category.id] ?? 0;
            const limitValue = Number(values[category.id]);
            const hasLimit = Number.isFinite(limitValue) && limitValue > 0;
            const overBy = hasLimit ? planned - limitValue : 0;
            return (
              <div
                key={category.id}
                className="rounded-lg border border-border/60 bg-muted/20 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {t.budget.categories[category.id]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.budgetCaps.plannedLabel}:{" "}
                      {formatCurrency(planned, currency)}
                      {hasLimit
                        ? ` / ${t.budgetCaps.capLabel}: ${formatCurrency(
                            limitValue,
                            currency,
                          )}`
                        : ` / ${t.budgetCaps.noCap}`}
                    </p>
                    {hasLimit && overBy > 0 ? (
                      <p className="text-xs text-destructive">
                        {t.budgetCaps.overBy} {formatCurrency(overBy, currency)}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2 md:w-48">
                    <Label htmlFor={`cap-${category.id}`}>
                      {t.budgetCaps.capInputLabel}
                    </Label>
                    <Input
                      id={`cap-${category.id}`}
                      type="number"
                      min="0"
                      step="10"
                      value={values[category.id]}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [category.id]: event.target.value,
                        }))
                      }
                      placeholder={t.budgetCaps.noCap}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end">
          {readOnly ? (
            <p className="text-xs text-muted-foreground">
              {t.budgetCaps.viewOnly}
            </p>
          ) : (
            <Button type="button" onClick={handleSave} disabled={saving}>
              {saving ? t.budgetCaps.saving : t.budgetCaps.saveCaps}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
