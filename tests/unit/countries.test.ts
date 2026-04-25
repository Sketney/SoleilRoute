import { describe, expect, it } from "vitest";
import {
  countryCodeToName,
  countryNameToCode,
  getCountryOptions,
} from "@/lib/countries";

describe("countries", () => {
  it("builds a broad ISO2 country option list for visa pickers", () => {
    const options = getCountryOptions();

    expect(options.length).toBeGreaterThan(190);
    expect(options).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "CN",
          name: "China",
          search: expect.stringContaining("china"),
        }),
        expect.objectContaining({
          code: "ID",
          name: "Indonesia",
          search: expect.stringContaining("indonesia"),
        }),
      ]),
    );
  });

  it("maps common country names and aliases to ISO2 codes", () => {
    expect(countryNameToCode("China")).toBe("CN");
    expect(countryNameToCode("Indonesia")).toBe("ID");
    expect(countryNameToCode("Russian Federation")).toBe("RU");
    expect(countryNameToCode("USA")).toBe("US");
    expect(countryNameToCode("United Kingdom")).toBe("GB");
  });

  it("maps ISO2 codes back to display names", () => {
    expect(countryCodeToName("CN")).toBe("China");
    expect(countryCodeToName("ID")).toBe("Indonesia");
    expect(countryCodeToName("RU")).toBe("Russia");
  });
});
