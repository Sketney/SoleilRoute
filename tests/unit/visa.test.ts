import { describe, expect, it } from "vitest";
import { getVisaRequirement } from "@/lib/services/visa";

describe("getVisaRequirement", () => {
  it("returns a match for a known route", async () => {
    const requirement = await getVisaRequirement("USA", "Japan");

    expect(requirement).not.toBeNull();
    expect(requirement?.visaRequired).toBe(false);
    expect(requirement?.visaType.length).toBeGreaterThan(0);
  });

  it("returns null when route is unknown", async () => {
    const requirement = await getVisaRequirement("Atlantis", "El Dorado");

    expect(requirement).toBeNull();
  });
});
