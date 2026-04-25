import { describe, expect, it } from "vitest";
import { manualOverrideToVisaRequirement } from "@/lib/services/visa-qa";

describe("visa QA overrides", () => {
  it("normalizes an active manual override into a visa requirement", () => {
    const requirement = manualOverrideToVisaRequirement({
      citizenship: "USA",
      destination: "Japan",
      visa_required: false,
      visa_type: "Visa waiver",
      validity: "90 days",
      processing_time: "Instant",
      cost: 0,
      currency: "USD",
      embassy_url: "https://example.test",
      notes: "Admin verified against official guidance.",
    });

    expect(requirement).toMatchObject({
      citizenship: "USA",
      destination: "Japan",
      visaRequired: false,
      visaType: "Visa waiver",
      validity: "90 days",
      processingTime: "Instant",
      currency: "USD",
      embassyUrl: "https://example.test",
    });
    expect(requirement.notes).toContain("Admin verified");
  });
});
