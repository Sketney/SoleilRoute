import { budgetCategories, type BudgetCategoryId } from "@/lib/constants";
import {
  budgetTierSplits,
  type BudgetTier,
} from "@/lib/budget-planner-data";

export type BudgetSplitItem = {
  category: BudgetCategoryId;
  amount: number;
};

export type BudgetSplitOptions = {
  excludeCategories?: BudgetCategoryId[];
  includeExcluded?: boolean;
};

export function splitBudgetEvenly(
  totalBudget: number,
  categories: readonly { id: BudgetCategoryId }[] = budgetCategories,
): BudgetSplitItem[] {
  if (!Number.isFinite(totalBudget) || categories.length === 0) {
    return [];
  }

  const normalizedTotal = Math.max(0, Math.round(totalBudget));
  const base = Math.floor(normalizedTotal / categories.length);
  let remainder = normalizedTotal - base * categories.length;

  return categories.map((category) => {
    const extra = remainder > 0 ? 1 : 0;
    remainder = Math.max(remainder - extra, 0);
    return {
      category: category.id,
      amount: base + extra,
    };
  });
}

export function splitBudgetByTier(
  totalBudget: number,
  tier: BudgetTier,
  options?: BudgetSplitOptions,
): BudgetSplitItem[] {
  if (!Number.isFinite(totalBudget)) {
    return [];
  }

  const normalizedTotal = Math.max(0, Math.round(totalBudget));
  const weights = budgetTierSplits[tier];
  const excluded = new Set(options?.excludeCategories ?? []);
  const includeExcluded = Boolean(options?.includeExcluded);
  const includedCategories = budgetCategories.filter(
    (category) => !excluded.has(category.id),
  );

  if (includedCategories.length === 0) {
    return includeExcluded
      ? budgetCategories
          .filter((category) => excluded.has(category.id))
          .map((category) => ({ category: category.id, amount: 0 }))
      : [];
  }

  if (!weights) {
    const baseSplit = splitBudgetEvenly(normalizedTotal, includedCategories);
    return mapSplitToCategories(baseSplit, excluded, includeExcluded);
  }

  const includedWeightTotal = includedCategories.reduce(
    (sum, category) => sum + (weights[category.id] ?? 0),
    0,
  );

  if (includedWeightTotal <= 0) {
    const baseSplit = splitBudgetEvenly(normalizedTotal, includedCategories);
    return mapSplitToCategories(baseSplit, excluded, includeExcluded);
  }

  const allocations = includedCategories.map((category) => {
    const percent = ((weights[category.id] ?? 0) / includedWeightTotal) * 100;
    const raw = (normalizedTotal * percent) / 100;
    return {
      category: category.id,
      amount: Math.floor(raw),
      remainder: raw - Math.floor(raw),
    };
  });

  let remainder = normalizedTotal - allocations.reduce((sum, item) => sum + item.amount, 0);
  if (remainder > 0) {
    allocations
      .sort((a, b) => b.remainder - a.remainder)
      .forEach((item) => {
        if (remainder <= 0) {
          return;
        }
        item.amount += 1;
        remainder -= 1;
      });
  }

  return mapSplitToCategories(
    allocations.map(({ category, amount }) => ({ category, amount })),
    excluded,
    includeExcluded,
  );
}

function mapSplitToCategories(
  split: BudgetSplitItem[],
  excluded: Set<BudgetCategoryId>,
  includeExcluded: boolean,
): BudgetSplitItem[] {
  const splitMap = new Map(
    split.map((item) => [item.category, item.amount]),
  );
  return budgetCategories.flatMap((category) => {
    if (splitMap.has(category.id)) {
      return { category: category.id, amount: splitMap.get(category.id) ?? 0 };
    }
    if (includeExcluded && excluded.has(category.id)) {
      return { category: category.id, amount: 0 };
    }
    return [];
  });
}
