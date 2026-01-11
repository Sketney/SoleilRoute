import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck, ShieldX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { getVisaRequirement } from "@/lib/services/visa";
import { getServerSession } from "@/lib/auth/session";
import { canEditTrip, getTripAccess } from "@/server/db";
import { VisaStatusEditor } from "@/components/dashboard/visa-status-editor";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n";

export const metadata = {
  title: "Trip visa checklist",
};

export default async function TripVisaPage({
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

  const visaRequirement = await getVisaRequirement(
    trip.citizenship,
    trip.destination_country,
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Button asChild size="sm" variant="ghost">
          <Link href={`/dashboard/trips/${trip.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.tripVisaPage.backToOverview}
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">{t.tripVisaPage.title}</h1>
          <p className="text-sm text-muted-foreground">
            {trip.name} -{" "}
            {t.tripVisaPage.subtitle(
              trip.citizenship,
              trip.destination_country,
            )}
          </p>
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.tripVisaPage.requirementsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <VisaStatusEditor
            tripId={trip.id}
            status={trip.visa_status ?? "unknown"}
            lastChecked={trip.visa_last_checked ?? null}
            readOnly={!canEdit}
          />
          {visaRequirement ? (
            <>
              <div className="flex items-center gap-3">
                <Badge
                  variant={visaRequirement.visaRequired ? "danger" : "success"}
                >
                  {visaRequirement.visaRequired ? (
                    <span className="flex items-center gap-1">
                      <ShieldX className="h-4 w-4" />
                      {t.tripVisaPage.visaRequired}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-4 w-4" />
                      {t.tripVisaPage.visaNotRequired}
                    </span>
                  )}
                </Badge>
                {visaRequirement.visaType ? (
                  <span className="text-sm text-muted-foreground">
                    {visaRequirement.visaType}
                  </span>
                ) : null}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {visaRequirement.validity ? (
                  <Detail
                    label={t.tripVisaPage.detailValidity}
                    value={visaRequirement.validity}
                  />
                ) : null}
                {visaRequirement.processingTime ? (
                  <Detail
                    label={t.tripVisaPage.detailProcessing}
                    value={visaRequirement.processingTime}
                  />
                ) : null}
                <Detail
                  label={t.tripVisaPage.detailCost}
                  value={
                    visaRequirement.cost
                      ? formatCurrency(
                          visaRequirement.cost,
                          visaRequirement.currency ?? trip.currency,
                        )
                      : t.tripVisaPage.noFee
                  }
                />
                {visaRequirement.embassyUrl ? (
                  <Detail
                    label={t.tripVisaPage.detailEmbassy}
                    value={
                      <a
                        className="text-link underline"
                        href={visaRequirement.embassyUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t.tripVisaPage.embassyLink}
                      </a>
                    }
                  />
                ) : null}
              </div>
              {visaRequirement.notes ? (
                <p className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                  {visaRequirement.notes}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t.tripVisaPage.noCache}
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}
