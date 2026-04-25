"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ExternalLink,
  Globe2,
  Search,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import type { TravelInsights, VisaRequirement } from "@/lib/services/visa";
import { TripForm } from "@/components/forms/trip-form";
import { useToast } from "@/components/ui/use-toast";
import { useLocale, useTranslations } from "@/components/providers/app-providers";
import { localizeVisaValue } from "@/lib/visa-localization";
import {
  countryCodeToName,
  countryNameToCode,
  getCountryOptions,
  type CountryOption,
} from "@/lib/countries";

const storageKey = "visa-checker-state";

type StoredVisaCheckerState = {
  citizenship?: string;
  destination?: string;
  citizenshipCode?: string;
  destinationCode?: string;
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
      typeof parsed?.citizenship === "string" ||
      typeof parsed?.destination === "string" ||
      typeof parsed?.citizenshipCode === "string" ||
      typeof parsed?.destinationCode === "string"
    ) {
      return {
        citizenship: parsed.citizenship,
        destination: parsed.destination,
        citizenshipCode: parsed.citizenshipCode,
        destinationCode: parsed.destinationCode,
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
  const { locale } = useLocale();
  const [citizenshipCode, setCitizenshipCode] = useState(() => {
    const stored = readStoredState();
    return (
      stored?.citizenshipCode ??
      countryNameToCode(stored?.citizenship ?? "") ??
      "US"
    );
  });
  const [destinationCode, setDestinationCode] = useState(() => {
    const stored = readStoredState();
    return (
      stored?.destinationCode ??
      countryNameToCode(stored?.destination ?? "") ??
      "JP"
    );
  });
  const [result, setResult] = useState<VisaRequirement | null>(null);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState(false);
  const [insights, setInsights] = useState<TravelInsights | null>(null);
  const [checking, setChecking] = useState(false);
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const canCreateTrip = Boolean(destinationCode) && Boolean(citizenshipCode);
  const countryOptions = useMemo(
    () => getCountryOptions(locale),
    [locale],
  );
  const selectedCitizenship = useMemo(
    () => countryOptions.find((option) => option.code === citizenshipCode),
    [citizenshipCode, countryOptions],
  );
  const selectedDestination = useMemo(
    () => countryOptions.find((option) => option.code === destinationCode),
    [destinationCode, countryOptions],
  );
  const tripCitizenship =
    countryCodeToName(citizenshipCode) ?? selectedCitizenship?.name ?? "";
  const tripDestination =
    countryCodeToName(destinationCode) ?? selectedDestination?.name ?? "";

  const tripDefaults = useMemo(
    () => ({
      name: tripDestination ? t.visaChecker.tripName(tripDestination) : "",
      destinationCountry: tripDestination,
      citizenship: tripCitizenship,
    }),
    [tripCitizenship, tripDestination, t],
  );

  const handleCheck = async () => {
    if (!destinationCode || !citizenshipCode) {
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
          citizenship: citizenshipCode,
          destination: destinationCode,
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
      setSource(data.source ?? null);
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
        citizenship: tripCitizenship,
        destination: tripDestination,
        citizenshipCode,
        destinationCode,
      };
      window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
    }
    setResult(null);
    setCheckedAt(null);
    setSource(null);
    setFallbackNotice(false);
    setInsights(null);
  }, [citizenshipCode, destinationCode, tripCitizenship, tripDestination]);

  return (
    <Card className="border-border/70">
      <CardHeader className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <CardTitle>{t.visaChecker.title}</CardTitle>
          <p className="max-w-3xl text-sm text-muted-foreground">
            {t.visaChecker.description}
          </p>
        </div>
        <Badge variant="secondary" className="w-fit gap-2">
          <Globe2 className="h-3.5 w-3.5" />
          Travel Buddy API
        </Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <CountryPicker
            label={t.visaChecker.citizenshipLabel}
            options={countryOptions}
            placeholder={t.visaChecker.citizenshipSearchPlaceholder}
            value={citizenshipCode}
            onChange={setCitizenshipCode}
          />
          <CountryPicker
            label={t.visaChecker.destinationLabel}
            options={countryOptions}
            placeholder={t.visaChecker.destinationSearchPlaceholder}
            value={destinationCode}
            onChange={setDestinationCode}
          />
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
          <VisaMeta checkedAt={checkedAt} source={source} fallback={fallbackNotice} />
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

function CountryPicker({
  label,
  value,
  options,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  options: CountryOption[];
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find((option) => option.code === value);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredOptions = normalizedQuery
    ? options
        .filter((option) => option.search.includes(normalizedQuery))
        .slice(0, 80)
    : options.slice(0, 80);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className="relative space-y-2">
      <Label>{label}</Label>
      <button
        type="button"
        className="flex h-11 w-full items-center justify-between rounded-lg border border-stone-300 bg-white px-3 text-left text-sm text-stone-900 ring-offset-background transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 dark:border-stone-700 dark:bg-stone-950 dark:text-white"
        onClick={() => {
          setOpen((current) => !current);
          setQuery("");
        }}
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="truncate">
            {selected ? selected.name : placeholder}
          </span>
          {selected ? (
            <span className="rounded border border-border/70 px-1.5 py-0.5 text-xs text-muted-foreground">
              {selected.code}
            </span>
          ) : null}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>
      {open ? (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-popover p-2 text-popover-foreground shadow-lg">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpen(false);
                }
              }}
              placeholder={placeholder}
              className="pl-9"
            />
          </div>
          <ScrollArea className="mt-2 h-72">
            <div className="space-y-1 pr-2">
              {filteredOptions.length ? (
                filteredOptions.map((option) => (
                  <button
                    key={option.code}
                    type="button"
                    className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      onChange(option.code);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span className="truncate">{option.name}</span>
                    <span className="ml-3 rounded border border-border/70 px-1.5 py-0.5 text-xs text-muted-foreground">
                      {option.code}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No countries found.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      ) : null}
    </div>
  );
}

function VisaResult({ result }: { result: VisaRequirement }) {
  const t = useTranslations();
  const { locale } = useLocale();
  const visaType = localizeVisaValue(result.visaType, locale);
  const validity = localizeVisaValue(result.validity, locale);
  const processingTime = localizeVisaValue(result.processingTime, locale);
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
        <Detail label={t.visaChecker.detailVisaType} value={visaType} />
        <Detail label={t.visaChecker.detailValidity} value={validity} />
        <Detail
          label={t.visaChecker.detailProcessing}
          value={processingTime}
        />
        <Detail
          label={t.visaChecker.detailCost}
          value={
            result.cost
              ? formatCurrency(result.cost, result.currency)
              : t.visaChecker.noFee
          }
        />
        {result.passportValidity ? (
          <Detail
            label={t.visaChecker.detailPassportValidity}
            value={localizeVisaValue(result.passportValidity, locale)}
          />
        ) : null}
      </div>
      {result.mandatoryRegistration ? (
        <div className="rounded-lg border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-950/20 dark:text-amber-100">
          <p className="font-medium">{t.visaChecker.mandatoryRegistrationLabel}</p>
          <p className="mt-1">{result.mandatoryRegistration.name}</p>
          {result.mandatoryRegistration.link ? (
            <a
              href={result.mandatoryRegistration.link}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              {t.visaChecker.applicationLink}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      ) : null}
      {result.notes ? (
        <div className="rounded-lg border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
          {result.notes}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-3">
        {result.applicationUrl ? (
          <Button asChild variant="default">
            <a href={result.applicationUrl} target="_blank" rel="noreferrer">
              {t.visaChecker.applicationLink}
            </a>
          </Button>
        ) : null}
        {result.embassyUrl ? (
          <Button asChild variant="outline">
            <a href={result.embassyUrl} target="_blank" rel="noreferrer">
              {t.visaChecker.viewEmbassy}
            </a>
          </Button>
        ) : null}
      </div>
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

function VisaMeta({
  checkedAt,
  source,
  fallback,
}: {
  checkedAt: string | null;
  source: string | null;
  fallback: boolean;
}) {
  const { locale } = useLocale();
  const t = useTranslations();
  if (!checkedAt && !source) {
    return null;
  }

  return (
    <div className="space-y-1 text-xs text-muted-foreground">
      {checkedAt ? (
        <div>
          {t.visaChecker.lastCheckedLabel}:{" "}
          {formatTimestamp(locale, checkedAt, t.common.justNow)}
        </div>
      ) : null}
      {source ? (
        <div>
          {t.visaChecker.sourceLabel}: {source}
          {fallback ? " (fallback)" : ""}
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
