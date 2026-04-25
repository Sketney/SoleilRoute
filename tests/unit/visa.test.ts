import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getVisaRequirement,
  getVisaRequirementWithSource,
} from "@/lib/services/visa";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

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

  it("uses Travel Buddy v2 as the primary visa source when configured", async () => {
    vi.stubEnv("TRAVEL_BUDDY_RAPIDAPI_KEY", "test-key");
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const href = String(url);
      if (href.includes("visa-requirement.p.rapidapi.com")) {
        return new Response(
          JSON.stringify({
            data: {
              passport: {
                code: "CN",
                name: "China",
                currency_code: "CNY",
              },
              destination: {
                code: "ID",
                name: "Indonesia",
                capital: "Jakarta",
                currency_code: "IDR",
                currency: "Indonesian Rupiah",
                passport_validity: "3 months beyond the period of stay",
                embassy_url: "https://www.embassypages.com/china",
              },
              mandatory_registration: {
                name: "e-Arrival",
                link: "https://example.test/arrival",
              },
              visa_rules: {
                primary_rule: {
                  name: "Visa on arrival",
                  duration: "30 days",
                  color: "blue",
                },
                secondary_rule: {
                  name: "eVisa",
                  duration: "30 days",
                  color: "blue",
                  link: "https://example.test/evisa",
                },
              },
            },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      return new Response("[]", {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const lookup = await getVisaRequirementWithSource("China", "Indonesia");

    expect(lookup.source).toBe("Travel Buddy");
    expect(lookup.fallback).toBe(false);
    expect(lookup.requirement).toMatchObject({
      citizenship: "China",
      destination: "Indonesia",
      visaRequired: true,
      visaType: "Visa on arrival / eVisa",
      validity: "30 days",
      processingTime: "See official guidance",
      cost: 0,
      currency: "IDR",
      embassyUrl: "https://www.embassypages.com/china",
      applicationUrl: "https://example.test/evisa",
      passportValidity: "3 months beyond the period of stay",
      mandatoryRegistration: {
        name: "e-Arrival",
        link: "https://example.test/arrival",
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://visa-requirement.p.rapidapi.com/v2/visa/check",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "X-RapidAPI-Key": "test-key",
          "X-RapidAPI-Host": "visa-requirement.p.rapidapi.com",
        }),
        body: JSON.stringify({ passport: "CN", destination: "ID" }),
      }),
    );
  });
});
