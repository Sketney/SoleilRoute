import type { VisaRequirement } from "@/lib/services/visa";

export type ManualVisaOverrideInput = {
  citizenship: string;
  destination: string;
  visa_required: boolean;
  visa_type: string | null;
  validity: string | null;
  processing_time: string | null;
  cost: number | null;
  currency: string | null;
  embassy_url: string | null;
  application_url?: string | null;
  passport_validity?: string | null;
  notes: string | null;
};

function clean(value: string | null | undefined, fallback = "") {
  return value?.trim() || fallback;
}

export function manualOverrideToVisaRequirement(
  override: ManualVisaOverrideInput,
): VisaRequirement {
  const cost =
    typeof override.cost === "number" && Number.isFinite(override.cost)
      ? override.cost
      : 0;

  return {
    citizenship: clean(override.citizenship),
    destination: clean(override.destination),
    visaRequired: override.visa_required,
    visaType: clean(
      override.visa_type,
      override.visa_required ? "Visa required" : "Visa not required",
    ),
    validity: clean(override.validity, "Check official guidance"),
    processingTime: clean(override.processing_time, "Check official guidance"),
    cost,
    currency: clean(override.currency, cost > 0 ? "USD" : ""),
    embassyUrl: clean(override.embassy_url),
    applicationUrl: clean(override.application_url) || undefined,
    passportValidity: clean(override.passport_validity) || undefined,
    notes: clean(override.notes) || undefined,
  };
}
