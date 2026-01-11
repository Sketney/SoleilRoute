"use client";

import { useMemo, useState } from "react";
import { TripList, type DashboardTrip } from "@/components/dashboard/trip-list";
import { visaStatusOptions } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/providers/app-providers";

type TripsViewProps = {
  trips: DashboardTrip[];
};

export function TripsView({ trips }: TripsViewProps) {
  const t = useTranslations();
  const sortOptions = [
    { value: "upcoming", label: t.tripsView.sortOptions.upcoming },
    { value: "latest", label: t.tripsView.sortOptions.latest },
    { value: "ending", label: t.tripsView.sortOptions.ending },
    { value: "name", label: t.tripsView.sortOptions.name },
    { value: "visa_status", label: t.tripsView.sortOptions.visa_status },
    { value: "budget_high", label: t.tripsView.sortOptions.budget_high },
    { value: "budget_low", label: t.tripsView.sortOptions.budget_low },
  ] as const;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]["value"]>(
    "upcoming",
  );
  const statusOptions = useMemo(
    () =>
      visaStatusOptions.map((option) => ({
        value: option.value,
        label: t.visa.statuses[option.value],
      })),
    [t],
  );

  const filteredTrips = useMemo(() => {
    const term = search.trim().toLowerCase();
    let result = trips;

    if (term) {
      result = result.filter((trip) => {
        const haystack = [
          trip.name,
          trip.destination.city,
          trip.destination.country,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    if (statusFilter !== "all") {
      result = result.filter((trip) => trip.visaStatus === statusFilter);
    }

    const sorted = [...result];
    const visaPriority: Record<DashboardTrip["visaStatus"], number> = {
      required: 0,
      in_progress: 1,
      unknown: 2,
      approved: 3,
      not_required: 4,
    };
    sorted.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "visa_status") {
        return visaPriority[a.visaStatus] - visaPriority[b.visaStatus];
      }
      if (sortBy === "budget_high") {
        return b.totalBudget - a.totalBudget;
      }
      if (sortBy === "budget_low") {
        return a.totalBudget - b.totalBudget;
      }
      const dateKey = sortBy === "ending" ? "endDate" : "startDate";
      const aTime = new Date(a[dateKey]).getTime();
      const bTime = new Date(b[dateKey]).getTime();
      const aSafe = Number.isNaN(aTime) ? 0 : aTime;
      const bSafe = Number.isNaN(bTime) ? 0 : bTime;
      if (sortBy === "latest") {
        return bSafe - aSafe;
      }
      return aSafe - bSafe;
    });

    return sorted;
  }, [search, sortBy, statusFilter, trips]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-muted/20 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
          <Input
            placeholder={t.tripsView.searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="md:max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder={t.tripsView.statusPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.tripsView.statusAll}</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value) =>
              setSortBy(value as (typeof sortOptions)[number]["value"])
            }
          >
            <SelectTrigger className="md:w-48">
              <SelectValue placeholder={t.tripsView.sortPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setSortBy("upcoming");
          }}
        >
          {t.tripsView.resetFilters}
        </Button>
      </div>
      <TripList trips={filteredTrips} />
    </div>
  );
}
