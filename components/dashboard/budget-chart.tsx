"use client";

import { useSyncExternalStore } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { percentage, formatCurrency } from "@/lib/utils";
import type { BudgetCategoryId } from "@/lib/constants";
import { useTranslations } from "@/components/providers/app-providers";

const categoryPalette: Record<BudgetCategoryId, string> = {
  transport: "#3B82F6",
  accommodation: "#10B981",
  food: "#F97316",
  activities: "#8B5CF6",
  visa: "#F43F5E",
  other: "#6366F1",
};
const plannedColor = "hsl(var(--chart-1))";
const paidColor = "hsl(var(--chart-2))";

export type BudgetItemSummary = {
  category: BudgetCategoryId;
  planned: number;
  paid: number;
};

interface BudgetChartProps {
  items: BudgetItemSummary[];
  totalBudget: number;
  currency: string;
}

export function BudgetChart({ items, totalBudget, currency }: BudgetChartProps) {
  const t = useTranslations();
  const categoryLabels = t.budget.categories;
  const plannedLabel = t.budgetChart.plannedLabel;
  const paidLabel = t.budgetChart.paidLabel;
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const pieData = items.map((item) => ({
    name: categoryLabels[item.category],
    value: item.planned,
    percent: percentage(item.planned, totalBudget),
    category: item.category,
  }));

  const barData = items.map((item) => ({
    category: categoryLabels[item.category],
    [plannedLabel]: item.planned,
    [paidLabel]: item.paid,
  }));

  return (
    <Card className="border-stone-200 dark:border-stone-800">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{t.budgetChart.title}</CardTitle>
        <p className="text-sm text-stone-500 dark:text-stone-400">
          {t.budgetChart.description}
        </p>
      </CardHeader>
      <CardContent className="grid min-w-0 gap-8 lg:grid-cols-[320px_1fr]">
        <div className="flex min-w-0 flex-col gap-6">
          <div className="h-64 min-h-[16rem] min-w-0">
            {isClient ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={categoryPalette[entry.category as BudgetCategoryId]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip currency={currency} />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full animate-pulse rounded-lg bg-stone-100 dark:bg-stone-950" />
            )}
          </div>
          <div className="space-y-3">
            {pieData.map((entry) => (
              <div
                key={entry.name}
                className="flex items-center justify-between rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm dark:border-stone-800 dark:bg-stone-950"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      backgroundColor:
                        categoryPalette[entry.category as BudgetCategoryId],
                    }}
                  />
                  <span>{entry.name}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                  {formatCurrency(entry.value, currency)}
                  <Badge variant="outline">{entry.percent}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex h-80 min-h-[20rem] w-full min-w-0 flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 dark:text-stone-400">
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: plannedColor }}
              />
              {plannedLabel}
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: paidColor }}
              />
              {paidLabel}
            </span>
          </div>
          <div className="min-h-0 flex-1">
            {isClient ? (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
              >
                <BarChart data={barData} barSize={20}>
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value, currency)}
                  />
                  <Tooltip content={<BarTooltip currency={currency} />} />
                  <Bar
                    dataKey={plannedLabel}
                    fill={plannedColor}
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey={paidLabel}
                    fill={paidColor}
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full animate-pulse rounded-lg bg-stone-100 dark:bg-stone-950" />
          )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type PieChartPayload = {
  name: string;
  value: number;
  payload: { percent: number };
};

type BarChartPayload = {
  dataKey: string;
  value: number;
  payload: {
    category: string;
  };
};

function PieTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: PieChartPayload[];
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-md border bg-background/95 p-3 text-xs shadow">
      <div className="font-medium">{item.name}</div>
      <div className="text-muted-foreground">
        {formatCurrency(item.value, currency)} ({item.payload.percent}%)
      </div>
    </div>
  );
}

function BarTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: BarChartPayload[];
  currency: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border bg-background/95 p-3 text-xs shadow">
      <div className="font-medium">{payload[0].payload.category}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex justify-between gap-6">
          <span>{entry.dataKey}</span>
          <span>{formatCurrency(entry.value, currency)}</span>
        </div>
      ))}
    </div>
  );
}

