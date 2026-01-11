export const budgetCategories = [
  { id: "transport", name: "Transport" },
  { id: "accommodation", name: "Accommodation" },
  { id: "food", name: "Food" },
  { id: "activities", name: "Activities" },
  { id: "visa", name: "Visa" },
  { id: "other", name: "Other" },
] as const;

export const supportedCurrencies = [
  "USD",
  "EUR",
  "GBP",
  "CAD",
  "AUD",
  "JPY",
  "CNY",
  "CHF",
  "SEK",
  "NOK",
  "PLN",
  "CZK",
  "TRY",
];

export const supportedCitizenships = [
  "USA",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Australia",
  "Brazil",
  "India",
  "China",
  "Japan",
  "South Africa",
  "Russia",
  "Turkey",
  "UAE",
  "Indonesia (Bali)",
  "Singapore",
  "Thailand",
];

export type BudgetCategoryId = (typeof budgetCategories)[number]["id"];

export const visaStatusOptions = [
  { value: "unknown", label: "Unknown" },
  { value: "required", label: "Visa required" },
  { value: "in_progress", label: "In progress" },
  { value: "approved", label: "Approved" },
  { value: "not_required", label: "Not required" },
] as const;

export type VisaStatus = (typeof visaStatusOptions)[number]["value"];
