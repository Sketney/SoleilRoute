import { z } from "zod";
import type { BudgetTier } from "@/lib/budget-planner-data";
import { countryCodeToName, countryNameToCode } from "@/lib/countries";

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
  citizenshipInvalid?: string;
  baseCurrencyLength: string;
  travelStyleRequired: string;
  endDateAfterStart: string;
  destinationCountryInvalid?: string;
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
  citizenshipInvalid: "Select a supported citizenship from the list.",
  baseCurrencyLength: "Base currency must be a 3-letter ISO code.",
  travelStyleRequired: "Travel style is required.",
  endDateAfterStart: "End date should be after the start date.",
  destinationCountryInvalid: "Select a supported destination country from the list.",
};

function createCountryFieldSchema(requiredMessage: string, invalidMessage: string) {
  return z
    .string()
    .min(2, requiredMessage)
    .transform((value) => value.trim())
    .superRefine((value, context) => {
      if (!countryNameToCode(value)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: invalidMessage,
        });
      }
    })
    .transform((value) => {
      const code = countryNameToCode(value);
      return code ? countryCodeToName(code) ?? value : value;
    });
}

export function createTripFormSchema(
  messages: Partial<TripFormValidationMessages> = {},
) {
  const text = { ...defaultMessages, ...messages };
  const destinationCountryRequired: string =
    text.destinationCountryRequired ?? "Destination country is required.";
  const destinationCountryInvalid: string =
    text.destinationCountryInvalid ?? "Select a supported destination country from the list.";
  const citizenshipRequired: string =
    text.citizenshipRequired ?? "Please enter your citizenship.";
  const citizenshipInvalid: string =
    text.citizenshipInvalid ?? "Select a supported citizenship from the list.";

  return z
    .object({
      name: z.string().min(3, text.nameMin),
      destinationCountry: createCountryFieldSchema(
        destinationCountryRequired,
        destinationCountryInvalid,
      ),
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
      citizenship: createCountryFieldSchema(
        citizenshipRequired,
        citizenshipInvalid,
      ),
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
