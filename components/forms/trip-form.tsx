"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  budgetCategories,
  supportedCitizenships,
  supportedCurrencies,
} from "@/lib/constants";
import { publicEnv } from "@/lib/env";
import { TripFormValues, createTripFormSchema } from "@/lib/validators/trip";
import type { BudgetTier } from "@/lib/budget-planner-data";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { refreshUnreadCount } from "@/lib/notifications-store";
import { useTranslations } from "@/components/providers/app-providers";

interface TripFormProps {
  onSuccess?: () => void;
  initialValues?: Partial<TripFormValues>;
  submitLabel?: string;
}

export function TripForm({
  onSuccess,
  initialValues,
  submitLabel,
}: TripFormProps) {
  const { toast } = useToast();
  const t = useTranslations();
  const router = useRouter();
  const schema = useMemo(
    () => createTripFormSchema(t.tripForm.validation),
    [t],
  );
  const resolvedSubmitLabel = submitLabel ?? t.tripForm.submitDefault;
  const [isPending, startTransition] = useTransition();
  const [citizenshipSearch, setCitizenshipSearch] = useState("");
  const tierOptions: Array<{ value: BudgetTier; label: string }> = [
    { value: "budget", label: t.budgetPlanner.tiers.budget.label },
    { value: "mid", label: t.budgetPlanner.tiers.mid.label },
    { value: "luxury", label: t.budgetPlanner.tiers.luxury.label },
  ];
  const defaultValues = useMemo(
    () => ({
      name: "",
      destinationCountry: "",
      destinationCity: "",
      startDate: undefined,
      endDate: undefined,
      totalBudget: 2500,
      travelStyle: "mid" as BudgetTier,
      currency: "USD",
      baseCurrency: publicEnv.EXCHANGE_RATE_BASE_CURRENCY,
      citizenship: "",
      notes: "",
      ...initialValues,
    }),
    [initialValues],
  );
  const form = useForm<TripFormValues>({
    resolver: zodResolver(schema) as Resolver<TripFormValues>,
    defaultValues,
  });
  const filteredCitizenships = supportedCitizenships.filter((country) =>
    country.toLowerCase().includes(citizenshipSearch.trim().toLowerCase()),
  );
  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = (values: TripFormValues) => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to create trip");
        }

        const data = (await response.json()) as { trip?: { id: string } };
        const tripId = data.trip?.id;

        toast({
          title: t.tripForm.createSuccessTitle,
          description: t.tripForm.createSuccessDescription,
        });
        void refreshUnreadCount();
        onSuccess?.();
        if (tripId) {
          router.push(`/dashboard/trips/${tripId}`);
        } else {
          router.push("/dashboard/trips");
        }
      } catch (error) {
        console.error(error);
        toast({
          title: t.tripForm.createErrorTitle,
          description: t.tripForm.createErrorDescription,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <form
      className="grid gap-6"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label={t.tripForm.fields.nameLabel}
          error={form.formState.errors.name?.message}
        >
          <Input
            id="trip-name"
            placeholder={t.tripForm.placeholders.name}
            data-testid="trip-name"
            {...form.register("name")}
          />
        </FormField>
        <FormField
          label={t.tripForm.fields.citizenshipLabel}
          error={form.formState.errors.citizenship?.message}
        >
          <Select
            value={form.watch("citizenship")}
            onValueChange={(value) => {
              form.setValue("citizenship", value);
              setCitizenshipSearch("");
            }}
          >
            <SelectTrigger data-testid="trip-citizenship">
              <SelectValue
                placeholder={t.tripForm.placeholders.selectCitizenship}
              />
            </SelectTrigger>
            <SelectContent>
              <div className="px-2 pt-2">
                <Input
                  value={citizenshipSearch}
                  onChange={(event) => setCitizenshipSearch(event.target.value)}
                  onKeyDown={(event) => event.stopPropagation()}
                  onPointerDown={(event) => event.stopPropagation()}
                  placeholder={t.tripForm.placeholders.searchCountries}
                  data-testid="trip-citizenship-search"
                  className="h-8"
                  autoFocus
                />
              </div>
              <SelectSeparator />
              {filteredCitizenships.length ? (
                filteredCitizenships.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-2 text-xs text-muted-foreground">
                  {t.budgetPlanner.noMatches}
                </div>
              )}
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label={t.tripForm.fields.destinationCountryLabel}
          error={form.formState.errors.destinationCountry?.message}
        >
          <Input
            placeholder={t.tripForm.placeholders.destinationCountry}
            data-testid="trip-destination-country"
            {...form.register("destinationCountry")}
          />
        </FormField>
        <FormField
          label={t.tripForm.fields.destinationCityLabel}
          error={form.formState.errors.destinationCity?.message}
        >
          <Input
            placeholder={t.tripForm.placeholders.destinationCity}
            data-testid="trip-destination-city"
            {...form.register("destinationCity")}
          />
        </FormField>
        <FormField
          label={t.tripForm.fields.startDateLabel}
          error={form.formState.errors.startDate?.message}
        >
          <Input
            type="date"
            data-testid="trip-start-date"
            {...form.register("startDate")}
          />
        </FormField>
        <FormField
          label={t.tripForm.fields.endDateLabel}
          error={form.formState.errors.endDate?.message}
        >
          <Input
            type="date"
            data-testid="trip-end-date"
            {...form.register("endDate")}
          />
        </FormField>
        <FormField
          label={t.tripForm.fields.totalBudgetLabel}
          error={form.formState.errors.totalBudget?.message}
        >
          <Input
            type="number"
            min="0"
            step="100"
            data-testid="trip-total-budget"
            {...form.register("totalBudget", { valueAsNumber: true })}
          />
        </FormField>
        <FormField
          label={t.tripForm.fields.travelStyleLabel}
          error={form.formState.errors.travelStyle?.message}
        >
          <Select
            value={form.watch("travelStyle")}
            onValueChange={(value) =>
              form.setValue("travelStyle", value as BudgetTier)
            }
          >
            <SelectTrigger data-testid="trip-travel-style">
              <SelectValue placeholder={t.tripForm.placeholders.travelStyle} />
            </SelectTrigger>
            <SelectContent>
              {tierOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField
          label={t.tripForm.fields.currencyLabel}
          error={form.formState.errors.currency?.message}
        >
          <Select
            value={form.watch("currency")}
            onValueChange={(value) => form.setValue("currency", value)}
          >
            <SelectTrigger data-testid="trip-currency">
              <SelectValue placeholder={t.tripForm.placeholders.currency} />
            </SelectTrigger>
            <SelectContent>
              {supportedCurrencies.map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField
        label={t.tripForm.fields.notesLabel}
        error={form.formState.errors.notes?.message}
      >
        <Textarea
          rows={4}
          placeholder={t.tripForm.placeholders.notes}
          {...form.register("notes")}
        />
      </FormField>
      <div className="rounded-lg border border-dashed border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
        {t.tripForm.autoSplitMessage(
          budgetCategories.length,
          budgetCategories
            .map((category) => t.budget.categories[category.id])
            .join(", "),
        )}
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        data-testid="trip-submit"
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t.tripForm.submitting}
          </span>
        ) : (
          resolvedSubmitLabel
        )}
      </Button>
    </form>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground/80">{label}</Label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
