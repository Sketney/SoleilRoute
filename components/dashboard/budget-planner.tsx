"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { budgetCategories } from "@/lib/constants";
import { cn, formatCurrency, percentage } from "@/lib/utils";
import {
  budgetTierSplits,
  budgetProfiles,
  type BudgetTier,
} from "@/lib/budget-planner-data";
import { useTranslations } from "@/components/providers/app-providers";

export function BudgetPlanner() {
  const t = useTranslations();
  const [selectedCountry, setSelectedCountry] = useState(
    budgetProfiles[0]?.country ?? "",
  );
  const [countrySearch, setCountrySearch] = useState("");
  const [days, setDays] = useState(5);
  const [travelers, setTravelers] = useState(1);
  const [tier, setTier] = useState<BudgetTier>("mid");

  const tierOptions: Array<{
    value: BudgetTier;
    label: string;
    description: string;
  }> = [
    {
      value: "budget",
      label: t.budgetPlanner.tiers.budget.label,
      description: t.budgetPlanner.tiers.budget.description,
    },
    {
      value: "mid",
      label: t.budgetPlanner.tiers.mid.label,
      description: t.budgetPlanner.tiers.mid.description,
    },
    {
      value: "luxury",
      label: t.budgetPlanner.tiers.luxury.label,
      description: t.budgetPlanner.tiers.luxury.description,
    },
  ];

  const profile = useMemo(
    () =>
      budgetProfiles.find((entry) => entry.country === selectedCountry) ??
      budgetProfiles[0],
    [selectedCountry],
  );
  const filteredProfiles = budgetProfiles.filter((entry) =>
    entry.country.toLowerCase().includes(countrySearch.trim().toLowerCase()),
  );

  const safeDays = Number.isFinite(days) && days > 0 ? days : 1;
  const safeTravelers =
    Number.isFinite(travelers) && travelers > 0 ? travelers : 1;

  const dailyBudget = profile?.dailyBudgets[tier] ?? 0;
  const totalBudget = dailyBudget * safeDays * safeTravelers;
  const tierSummaries = tierOptions.map((option) => {
    const daily = profile?.dailyBudgets[option.value] ?? 0;
    return {
      ...option,
      daily,
      total: daily * safeDays * safeTravelers,
    };
  });

  const breakdown = budgetCategories.map((category) => {
    const percent = budgetTierSplits[tier]?.[category.id] ?? 0;
    const value = Math.round((totalBudget * percent) / 100);
    return {
      id: category.id,
      name: t.budget.categories[category.id],
      percent,
      value,
    };
  });

  return (
    <div className="space-y-6">
      <Card className="border-border/70">
        <CardHeader className="space-y-1">
          <CardTitle>{t.budgetPlanner.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.budgetPlanner.description}
          </p>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.budgetPlanner.destinationLabel}</Label>
                <Select
                  value={selectedCountry}
                  onValueChange={(value) => {
                    setSelectedCountry(value);
                    setCountrySearch("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t.budgetPlanner.destinationPlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 pt-2">
                      <Input
                        value={countrySearch}
                        onChange={(event) =>
                          setCountrySearch(event.target.value)
                        }
                        onKeyDown={(event) => event.stopPropagation()}
                        onPointerDown={(event) => event.stopPropagation()}
                        placeholder={t.budgetPlanner.destinationSearchPlaceholder}
                        className="h-8"
                        autoFocus
                      />
                    </div>
                    <SelectSeparator />
                    {filteredProfiles.length ? (
                      filteredProfiles.map((entry) => (
                        <SelectItem key={entry.country} value={entry.country}>
                          {entry.country}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-2 text-xs text-muted-foreground">
                        {t.budgetPlanner.noMatches}
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.budgetPlanner.travelStyleLabel}</Label>
                <Select value={tier} onValueChange={(value) => setTier(value as BudgetTier)}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t.budgetPlanner.travelStylePlaceholder}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {tierOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.budgetPlanner.tripLengthLabel}</Label>
                <Input
                  type="number"
                  min="1"
                  value={days}
                  onChange={(event) => setDays(Number(event.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label>{t.budgetPlanner.travelersLabel}</Label>
                <Input
                  type="number"
                  min="1"
                  value={travelers}
                  onChange={(event) => setTravelers(Number(event.target.value))}
                />
              </div>
            </div>

            <Card className="border-border/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {t.budgetPlanner.tierTitle}
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  {t.budgetPlanner.tierDescription}
                </p>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {tierSummaries.map((summary) => (
                  <button
                    key={summary.value}
                    type="button"
                    onClick={() => setTier(summary.value)}
                    className={cn(
                      "rounded-lg border border-border/60 bg-muted/20 p-4 text-left transition",
                      summary.value === tier &&
                        "border-primary/60 bg-primary/5 shadow-sm",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-semibold">
                          {summary.label}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {summary.description}
                        </p>
                      </div>
                      {summary.value === tier ? (
                        <Badge variant="secondary">
                          {t.budgetPlanner.tierSelected}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-3 grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t.budgetPlanner.tierPerDay}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(summary.daily, profile?.currency ?? "USD")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {t.budgetPlanner.tierPerTrip}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(summary.total, profile?.currency ?? "USD")}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-border/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {t.budgetPlanner.dailyEstimateTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-semibold">
                    {profile
                      ? formatCurrency(dailyBudget, profile.currency)
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t.budgetPlanner.dailyEstimateNote(
                      profile?.currency ?? "USD",
                    )}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/70">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {t.budgetPlanner.totalEstimateTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-semibold">
                    {profile
                      ? formatCurrency(totalBudget, profile.currency)
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {t.budgetPlanner.totalEstimateNote(
                      safeDays,
                      safeTravelers,
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {t.budgetPlanner.categorySplitTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {breakdown.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(item.value, profile?.currency ?? "USD")} (
                        {item.percent}%)
                      </span>
                    </div>
                    <Progress value={percentage(item.value, totalBudget)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="border-border/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {t.budgetPlanner.highlightsTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile?.highlights.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-border/70">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {t.budgetPlanner.notesTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>{profile?.notes ?? t.budgetPlanner.notesFallback}</p>
                <div className="flex flex-wrap gap-2">
                  {tierOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant={option.value === tier ? "default" : "outline"}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t.budgetPlanner.estimatesFootnote}
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
