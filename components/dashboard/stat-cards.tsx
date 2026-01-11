import { ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export type StatCard = {
  label: string;
  value: number;
  currency?: string;
  helper?: string;
  trend?: {
    value: number;
    label: string;
  };
};

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-stone-200 dark:border-stone-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-400">
              {stat.label}
            </CardTitle>
            {stat.trend ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                <ArrowUpRight className="h-3 w-3" />
                {stat.trend.value}%
              </span>
            ) : null}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              {stat.currency
                ? formatCurrency(stat.value, stat.currency)
                : stat.value}
            </div>
            {stat.helper ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">{stat.helper}</p>
            ) : null}
            {stat.trend ? (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {stat.trend.label}
              </p>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
