"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import type { VisaStatus } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { useTranslations } from "@/components/providers/app-providers";
import { TripForm } from "@/components/forms/trip-form";

export type DashboardTrip = {
  id: string;
  name: string;
  destination: {
    country: string;
    city: string;
  };
  startDate: string;
  endDate: string;
  totalBudget: number;
  currency: string;
  paidAmount: number;
  visaStatus: VisaStatus;
  role: "owner" | "editor" | "viewer";
};

const visaVariant: Record<
  DashboardTrip["visaStatus"],
  "default" | "secondary" | "success" | "warning" | "danger"
> = {
  unknown: "default",
  required: "danger",
  approved: "success",
  not_required: "secondary",
  in_progress: "warning",
};

export function TripList({ trips }: { trips: DashboardTrip[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();
  const [createOpen, setCreateOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const visaLabels: Record<VisaStatus, string> = {
    unknown: t.visa.statuses.unknown,
    required: t.visa.statuses.required,
    approved: t.visa.statuses.approved,
    not_required: t.visa.statuses.not_required,
    in_progress: t.visa.statuses.in_progress,
  };

  const handleDelete = async (tripId: string) => {
    const confirmed = window.confirm(t.tripList.confirmDelete);
    if (!confirmed) {
      return;
    }

    setDeletingId(tripId);
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      toast({
        title: t.tripList.toastDeleteTitle,
        description: t.tripList.toastDeleteDescription,
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: t.tripList.toastDeleteErrorTitle,
        description: t.tripList.toastDeleteErrorDescription,
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  if (trips.length === 0) {
    return (
      <Card className="border-border/70">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
          <CalendarDays className="h-10 w-10 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">{t.tripList.emptyTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {t.tripList.emptyDescription}
            </p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button data-testid="trips-empty-create">
                {t.tripForm.submitDefault}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{t.quickActions.dialogTitle}</DialogTitle>
                <DialogDescription>
                  {t.quickActions.dialogDescription}
                </DialogDescription>
              </DialogHeader>
              <TripForm
                onSuccess={() => {
                  setCreateOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {trips.map((trip) => {
        const progress = Math.min(
          Math.round((trip.paidAmount / trip.totalBudget) * 100),
          100,
        );
        const sharedLabel =
          trip.role === "owner"
            ? null
            : t.tripList.sharedLabel(
                trip.role === "editor"
                  ? t.collaborators.roleEditor
                  : t.collaborators.roleViewer,
              );
        return (
          <Card key={trip.id} className="border-border/70">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg">
                  <Link
                    href={`/dashboard/trips/${trip.id}`}
                    className="transition hover:text-foreground hover:underline hover:underline-offset-4"
                  >
                    {trip.name}
                  </Link>
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {trip.destination.city}, {trip.destination.country}
                  </span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <a href={`/dashboard/trips/${trip.id}`}>
                      {t.tripList.openTrip}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/dashboard/trips/${trip.id}/budget`}>
                      {t.tripList.manageBudget}
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href={`/dashboard/trips/${trip.id}/visa`}>
                      {t.tripList.visaChecklist}
                    </a>
                  </DropdownMenuItem>
                  {trip.role === "owner" ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={(event) => {
                          event.preventDefault();
                          handleDelete(trip.id);
                        }}
                        className="text-red-600 focus:text-red-600"
                        disabled={deletingId === trip.id}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {deletingId === trip.id
                          ? t.tripList.deleting
                          : t.tripList.deleteTrip}
                      </DropdownMenuItem>
                    </>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                <Badge variant={visaVariant[trip.visaStatus]}>
                  {visaLabels[trip.visaStatus]}
                </Badge>
                {sharedLabel ? (
                  <Badge variant="secondary">{sharedLabel}</Badge>
                ) : null}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t.tripList.budgetProgressLabel}</span>
                  <span>
                    {formatCurrency(trip.paidAmount, trip.currency)} /{" "}
                    {formatCurrency(trip.totalBudget, trip.currency)}
                  </span>
                </div>
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">
                  {t.tripList.budgetProgressSummary(progress)}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
