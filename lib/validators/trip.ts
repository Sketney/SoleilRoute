import { z } from "zod";
import type { BudgetTier } from "@/lib/budget-planner-data";

export type TripFormValidationMessages = {
  nameMin: string;
  destinationCountryRequired: string;
  destinationCityRequired: string;
  startDateInvalid: string;
  startDateRequired: string;
  endDateInvalid: string;
  endDateRequired: string;
  totalBudgetInvalid: string;
  totalBudgetPositive: string;
  currencyLength: string;
  citizenshipRequired: string;
  baseCurrencyLength: string;
  travelStyleRequired: string;
  endDateAfterStart: string;
};

const defaultMessages: TripFormValidationMessages = {
  nameMin: "Trip name should be at least 3 characters.",
  destinationCountryRequired: "Destination country is required.",
  destinationCityRequired: "Destination city is required.",
  startDateInvalid: "Please provide a valid start date.",
  startDateRequired: "Start date is required.",
  endDateInvalid: "Please provide a valid end date.",
  endDateRequired: "End date is required.",
  totalBudgetInvalid: "Total budget must be a number.",
  totalBudgetPositive: "Budget must be greater than zero.",
  currencyLength: "Currency must be a 3-letter ISO code.",
  citizenshipRequired: "Please enter your citizenship.",
  baseCurrencyLength: "Base currency must be a 3-letter ISO code.",
  travelStyleRequired: "Travel style is required.",
  endDateAfterStart: "End date should be after the start date.",
};

export function createTripFormSchema(
  messages: Partial<TripFormValidationMessages> = {},
) {
  const text = { ...defaultMessages, ...messages };

  return z
    .object({
      name: z.string().min(3, text.nameMin),
      destinationCountry: z
        .string()
        .min(2, text.destinationCountryRequired)
        .transform((value) => value.trim()),
      destinationCity: z
        .string()
        .min(2, text.destinationCityRequired)
        .transform((value) => value.trim()),
      startDate: z.coerce.date({
        message: text.startDateInvalid,
      }),
      endDate: z.coerce.date({
        message: text.endDateInvalid,
      }),
      totalBudget: z.coerce
        .number({
          message: text.totalBudgetInvalid,
        })
        .positive(text.totalBudgetPositive),
      travelStyle: z.enum(["budget", "mid", "luxury"], {
        message: text.travelStyleRequired,
      }) as z.ZodType<BudgetTier>,
      currency: z
        .string()
        .length(3, text.currencyLength)
        .transform((value) => value.toUpperCase()),
      citizenship: z.string().min(2, text.citizenshipRequired),
      baseCurrency: z
        .string()
        .length(3, text.baseCurrencyLength)
        .transform((value) => value.toUpperCase()),
      notes: z.string().max(500).optional(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: text.endDateAfterStart,
    });
}

export const tripFormSchema = createTripFormSchema();

export type TripFormValues = z.infer<typeof tripFormSchema>;
