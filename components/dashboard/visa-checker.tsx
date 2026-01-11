"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supportedCitizenships } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { TravelInsights, VisaRequirement } from "@/lib/services/visa";
import { listVisaDataset } from "@/lib/services/visa";
import { TripForm } from "@/components/forms/trip-form";
import { useToast } from "@/components/ui/use-toast";
import { useLocale, useTranslations } from "@/components/providers/app-providers";

const visaDataset = listVisaDataset();
const storageKey = "visa-checker-state";

type StoredVisaCheckerState = {
  citizenship: string;
  destination: string;
};

function readStoredState(): StoredVisaCheckerState | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<StoredVisaCheckerState>;
    if (
      typeof parsed?.citizenship === "string" &&
      typeof parsed?.destination === "string"
    ) {
      return {
        citizenship: parsed.citizenship,
        destination: parsed.destination,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function VisaChecker() {
  const { toast } = useToast();
  const t = useTranslations();
  const [citizenship, setCitizenship] = useState(() => {
    const stored = readStoredState();
    return stored?.citizenship ?? "USA";
  });
  const [destination, setDestination] = useState(() => {
    const stored = readStoredState();
    return stored?.destination ?? "Japan";
  });
  const [result, setResult] = useState<VisaRequirement | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState(false);
  const [insights, setInsights] = useState<TravelInsights | null>(null);
  const [checking, setChecking] = useState(false);
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const canCreateTrip = Boolean(destination.trim()) && Boolean(citizenship.trim());
  const citizenshipOptions = useMemo(
    () => [...supportedCitizenships].sort((a, b) => a.localeCompare(b)),
    [],
  );
  const destinationOptions = useMemo(() => {
    const base = supportedCitizenships;
    const fromCache = visaDataset.map((entry) => entry.destination);
    return Array.from(new Set([...base, ...fromCache])).sort((a, b) =>
      a.localeCompare(b),
    );
  }, []);

  const tripDefaults = useMemo(
    () => ({
      name: destination.trim()
        ? t.visaChecker.tripName(destination.trim())
        : "",
      destinationCountry: destination.trim(),
      citizenship,
    }),
    [citizenship, destination, t],
  );

  const handleCheck = async () => {
    if (!destination.trim() || !citizenship.trim()) {
      toast({
        title: t.visaChecker.toastMissingTitle,
        description: t.visaChecker.toastMissingDescription,
        variant: "destructive",
      });
      return;
    }

    setChecking(true);
    try {
      const response = await fetch("/api/visa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          citizenship,
          destination: destination.trim(),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to check visa requirements");
      }
      const data = (await response.json()) as {
        visa: VisaRequirement | null;
        checkedAt?: string | null;
        source?: string | null;
        fallback?: boolean;
        insights?: TravelInsights | null;
      };
      setResult(data.visa ?? null);
      setCheckedAt(data.checkedAt ?? null);
      setFallbackNotice(Boolean(data.fallback));
      setInsights(data.insights ?? null);
    } catch (error) {
      console.error(error);
      toast({
        title: t.visaChecker.toastErrorTitle,
        description: t.visaChecker.toastErrorDescription,
        variant: "destructive",
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    void handleCheck();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const payload: StoredVisaCheckerState = {
        citizenship,
        destination,
      };
      window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
    }
    setResult(null);
    setCheckedAt(null);
    setFallbackNotice(false);
    setInsights(null);
  }, [citizenship, destination]);

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-col gap-2">
        <CardTitle>{t.visaChecker.title}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {t.visaChecker.description}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>{t.visaChecker.citizenshipLabel}</Label>
            <Input
              value={citizenship}
              onChange={(event) => setCitizenship(event.target.value)}
              placeholder={t.visaChecker.citizenshipSearchPlaceholder}
              list="citizenship-options"
            />
            <datalist id="citizenship-options">
              {citizenshipOptions.map((country) => (
                <option key={country} value={country} />
              ))}
            </datalist>
          </div>
          <div className="space-y-2">
            <Label>{t.visaChecker.destinationLabel}</Label>
            <Input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder={t.visaChecker.destinationPlaceholder}
              list="destination-options"
            />
            <datalist id="destination-options">
              {destinationOptions.map((entry) => (
                <option key={entry} value={entry} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={handleCheck} disabled={checking}>
              {checking ? t.visaChecker.checking : t.visaChecker.checkButton}
            </Button>
            <Dialog open={tripDialogOpen} onOpenChange={setTripDialogOpen}>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" disabled={!canCreateTrip}>
                  {t.visaChecker.addToTrip}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{t.visaChecker.createTripTitle}</DialogTitle>
                  <DialogDescription>
                    {t.visaChecker.createTripDescription}
                  </DialogDescription>
                </DialogHeader>
                <TripForm
                  initialValues={tripDefaults}
                  submitLabel={t.tripForm.submitDefault}
                  onSuccess={() => setTripDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          <VisaMeta checkedAt={checkedAt} />
        </div>
        <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-4 text-sm text-muted-foreground">
          {t.visaChecker.resultsNote}
        </div>
        {insights ? <TravelInsightsCard insights={insights} /> : null}
        {result ? (
          <VisaResult result={result} />
        ) : (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-6 text-sm text-muted-foreground">
            {t.visaChecker.emptyState}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TravelInsightsCard({ insights }: { insights: TravelInsights }) {
  const t = useTranslations();
  const currencyText = formatCurrencies(insights.currencies);
  const languageText = insights.languages?.join(", ") ?? "";
  const timezoneText = insights.timezones?.join(", ") ?? "";
  const callingText = insights.callingCodes?.join(", ") ?? "";

  return (
    <div className="rounded-lg border border-border/60 bg-background p-4">
      <div className="flex items-center gap-3">
        {insights.flagUrl ? (
          <img
            src={insights.flagUrl}
            alt={insights.name}
            className="h-8 w-12 rounded-md border border-border/60 object-cover"
            loading="lazy"
          />
        ) : null}
        <div>
          <p className="text-sm font-semibold">
            {insights.name || t.visaChecker.insightsTitle}
          </p>
          {insights.region ? (
            <p className="text-xs text-muted-foreground">
              {insights.region}
              {insights.subregion ? ` • ${insights.subregion}` : ""}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {insights.capital ? (
          <Insight label={t.visaChecker.insightsCapital} value={insights.capital} />
        ) : null}
        {currencyText ? (
          <Insight label={t.visaChecker.insightsCurrency} value={currencyText} />
        ) : null}
        {languageText ? (
          <Insight label={t.visaChecker.insightsLanguages} value={languageText} />
        ) : null}
        {timezoneText ? (
          <Insight label={t.visaChecker.insightsTimezones} value={timezoneText} />
        ) : null}
        {callingText ? (
          <Insight label={t.visaChecker.insightsCallingCodes} value={callingText} />
        ) : null}
      </div>
    </div>
  );
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground/80">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function formatCurrencies(
  currencies?: { code: string; name?: string; symbol?: string }[],
) {
  if (!currencies?.length) return "";
  return currencies
    .map((currency) => {
      const name = currency.name ? ` ${currency.name}` : "";
      const symbol = currency.symbol ? ` (${currency.symbol})` : "";
      return `${currency.code}${name}${symbol}`.trim();
    })
    .join(", ");
}

function VisaResult({ result }: { result: VisaRequirement }) {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            {result.citizenship} to {result.destination}
          </p>
          <p className="text-xs text-muted-foreground">
            {result.visaRequired
              ? t.visaChecker.resultStatusRequired
              : t.visaChecker.resultStatusFree}
          </p>
        </div>
        <Badge variant={result.visaRequired ? "danger" : "success"}>
          {result.visaRequired ? (
            <span className="flex items-center gap-2">
              <ShieldX className="h-3.5 w-3.5" />
              {t.visaChecker.badgeRequired}
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              {t.visaChecker.badgeNotRequired}
            </span>
          )}
        </Badge>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Detail label={t.visaChecker.detailVisaType} value={result.visaType} />
        <Detail label={t.visaChecker.detailValidity} value={result.validity} />
        <Detail
          label={t.visaChecker.detailProcessing}
          value={result.processingTime}
        />
        <Detail
          label={t.visaChecker.detailCost}
          value={
            result.cost
              ? formatCurrency(result.cost, result.currency)
              : t.visaChecker.noFee
          }
        />
      </div>
      {result.notes ? (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          {result.notes}
        </div>
      ) : null}
      {result.embassyUrl ? (
        <Button asChild variant="outline">
          <a href={result.embassyUrl} target="_blank" rel="noreferrer">
            {t.visaChecker.viewEmbassy}
          </a>
        </Button>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground/80">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function VisaMeta({ checkedAt }: { checkedAt: string | null }) {
  const { locale } = useLocale();
  const t = useTranslations();
  if (!checkedAt) {
    return null;
  }

  return (
    <div className="text-xs text-muted-foreground">
      {checkedAt ? (
        <div>
          {t.visaChecker.lastCheckedLabel}:{" "}
          {formatTimestamp(locale, checkedAt, t.common.justNow)}
        </div>
      ) : null}
    </div>
  );
}

function formatTimestamp(locale: string, timestamp: string, fallback: string) {
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return fallback;
  }
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
