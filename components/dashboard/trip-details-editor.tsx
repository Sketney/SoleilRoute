"use client";

import {
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTripFormSchema, type TripFormValues } from "@/lib/validators/trip";
import {
  supportedCitizenships,
  supportedCurrencies,
} from "@/lib/constants";
import type { BudgetTier } from "@/lib/budget-planner-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useTranslations } from "@/components/providers/app-providers";

type TripDetailsEditorProps = {
  tripId: string;
  initialValues: {
    name: string;
    destinationCountry: string;
    destinationCity: string;
    startDate: string;
    endDate: string;
    totalBudget: number;
    currency: string;
    citizenship: string;
    baseCurrency: string;
    travelStyle: BudgetTier;
    notes: string | null;
  };
  readOnly?: boolean;
};

export function TripDetailsEditor({
  tripId,
  initialValues,
  readOnly = false,
}: TripDetailsEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [citizenshipSearch, setCitizenshipSearch] = useState("");
  const tierOptions: Array<{ value: BudgetTier; label: string }> = [
    { value: "budget", label: t.budgetPlanner.tiers.budget.label },
    { value: "mid", label: t.budgetPlanner.tiers.mid.label },
    { value: "luxury", label: t.budgetPlanner.tiers.luxury.label },
  ];

  const startDate = new Date(initialValues.startDate);
  const endDate = new Date(initialValues.endDate);
  const schema = useMemo(
    () => createTripFormSchema(t.tripForm.validation),
    [t],
  );

  const form = useForm<TripFormValues>({
    resolver: zodResolver(schema) as Resolver<TripFormValues>,
    defaultValues: {
      name: initialValues.name,
      destinationCountry: initialValues.destinationCountry,
      destinationCity: initialValues.destinationCity,
      startDate: Number.isNaN(startDate.getTime()) ? undefined : startDate,
      endDate: Number.isNaN(endDate.getTime()) ? undefined : endDate,
      totalBudget: initialValues.totalBudget,
      travelStyle: initialValues.travelStyle,
      currency: initialValues.currency,
      baseCurrency: initialValues.baseCurrency,
      citizenship: initialValues.citizenship,
      notes: initialValues.notes ?? "",
    },
  });
  const filteredCitizenships = supportedCitizenships.filter((country) =>
    country.toLowerCase().includes(citizenshipSearch.trim().toLowerCase()),
  );

  if (readOnly) {
    return null;
  }

  const handleSubmit = (values: TripFormValues) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/trips/${tripId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error("Failed to update trip");
        }

        toast({
          title: t.tripDetailsEditor.toastSuccessTitle,
          description: t.tripDetailsEditor.toastSuccessDescription,
        });
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast({
          title: t.tripDetailsEditor.toastErrorTitle,
          description: t.tripDetailsEditor.toastErrorDescription,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {t.tripDetailsEditor.trigger}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t.tripDetailsEditor.title}</DialogTitle>
          <DialogDescription>
            {t.tripDetailsEditor.description}
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              label={t.tripForm.fields.nameLabel}
              error={form.formState.errors.name?.message}
            >
              <Input {...form.register("name")} />
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
                <SelectTrigger>
                  <SelectValue
                    placeholder={t.tripForm.placeholders.selectCitizenship}
                  />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 pt-2">
                    <Input
                      value={citizenshipSearch}
                      onChange={(event) =>
                        setCitizenshipSearch(event.target.value)
                      }
                      onKeyDown={(event) => event.stopPropagation()}
                      onPointerDown={(event) => event.stopPropagation()}
                      placeholder={t.tripForm.placeholders.searchCountries}
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
              <Input {...form.register("destinationCountry")} />
            </FormField>
            <FormField
              label={t.tripForm.fields.destinationCityLabel}
              error={form.formState.errors.destinationCity?.message}
            >
              <Input {...form.register("destinationCity")} />
            </FormField>
            <FormField
              label={t.tripForm.fields.startDateLabel}
              error={form.formState.errors.startDate?.message}
            >
              <Input type="date" {...form.register("startDate")} />
            </FormField>
            <FormField
              label={t.tripForm.fields.endDateLabel}
              error={form.formState.errors.endDate?.message}
            >
              <Input type="date" {...form.register("endDate")} />
            </FormField>
        <FormField
          label={t.tripForm.fields.totalBudgetLabel}
          error={form.formState.errors.totalBudget?.message}
        >
          <Input
            type="number"
            min="0"
            step="100"
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
            <SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder={t.tripForm.placeholders.currency} />
                </SelectTrigger>
                <SelectContent>
                  {supportedCurrencies.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField
              label={t.tripForm.fields.baseCurrencyLabel}
              error={form.formState.errors.baseCurrency?.message}
            >
              <Select
                value={form.watch("baseCurrency")}
                onValueChange={(value) => form.setValue("baseCurrency", value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t.tripForm.placeholders.baseCurrency}
                  />
                </SelectTrigger>
                <SelectContent>
                  {supportedCurrencies.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
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
            <Textarea rows={4} {...form.register("notes")} />
          </FormField>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t.tripDetailsEditor.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t.tripDetailsEditor.saving : t.tripDetailsEditor.save}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
