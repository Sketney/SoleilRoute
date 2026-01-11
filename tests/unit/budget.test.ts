import { describe, expect, it } from "vitest";
import { splitBudgetByTier } from "@/lib/budget";

describe("splitBudgetByTier", () => {
  it("splits total using tier weights", () => {
    const result = splitBudgetByTier(100, "mid");
    const totals = result.reduce((sum, item) => sum + item.amount, 0);

    const byCategory = new Map(result.map((item) => [item.category, item.amount]));

    expect(totals).toBe(100);
    expect(byCategory.get("transport")).toBe(20);
    expect(byCategory.get("accommodation")).toBe(35);
    expect(byCategory.get("food")).toBe(20);
    expect(byCategory.get("activities")).toBe(15);
    expect(byCategory.get("visa")).toBe(5);
    expect(byCategory.get("other")).toBe(5);
  });

  it("preserves total with rounding", () => {
    const totalBudget = 101;
    const result = splitBudgetByTier(totalBudget, "mid");
    const sum = result.reduce((acc, item) => acc + item.amount, 0);

    expect(sum).toBe(totalBudget);
    result.forEach((item) => {
      expect(item.amount).toBeGreaterThanOrEqual(0);
    });
  });

  it("redistributes excluded categories", () => {
    const result = splitBudgetByTier(100, "mid", {
      excludeCategories: ["visa"],
      includeExcluded: true,
    });
    const totals = result.reduce((sum, item) => sum + item.amount, 0);
    const byCategory = new Map(result.map((item) => [item.category, item.amount]));

    expect(totals).toBe(100);
    expect(byCategory.get("visa")).toBe(0);
    expect(byCategory.get("accommodation")).toBeGreaterThan(35);
  });
});
