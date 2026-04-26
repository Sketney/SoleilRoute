import { describe, expect, it } from "vitest";
import { tripFormSchema } from "@/lib/validators/trip";

const validTripPayload = {
  name: "Bali work trip",
  destinationCountry: "Indonesia",
  destinationCity: "Ubud",
  startDate: "2026-05-01",
  endDate: "2026-05-12",
  totalBudget: 2500,
  travelStyle: "mid",
  currency: "usd",
  citizenship: "United States",
  baseCurrency: "usd",
  notes: "",
} as const;

describe("trip form schema", () => {
  it("accepts canonical country names and normalizes their stored shape", () => {
    const parsed = tripFormSchema.parse(validTripPayload);

    expect(parsed.destinationCountry).toBe("Indonesia");
    expect(parsed.citizenship).toBe("United States");
    expect(parsed.currency).toBe("USD");
    expect(parsed.baseCurrency).toBe("USD");
  });

  it("normalizes legacy destination variants to canonical country names", () => {
    const parsed = tripFormSchema.parse({
      ...validTripPayload,
      destinationCountry: "Indonesia (Bali)",
    });

    expect(parsed.destinationCountry).toBe("Indonesia");
  });

  it("rejects unsupported destination strings outside the country catalog", () => {
    const parsed = tripFormSchema.safeParse({
      ...validTripPayload,
      destinationCountry: "Moonbase Alpha",
    });

    expect(parsed.success).toBe(false);
  });
});
