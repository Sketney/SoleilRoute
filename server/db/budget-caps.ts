import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { BudgetCategoryId } from "@/lib/constants";

export type BudgetCapRecord = {
  id: string;
  trip_id: string;
  category: BudgetCategoryId;
  limit_amount: number;
  currency: string;
  created_at: string;
  updated_at: string;
};

function cloneBudgetCap(cap: BudgetCapRecord | undefined): BudgetCapRecord | null {
  return cap ? { ...cap } : null;
}

export function listBudgetCaps(tripId: string): BudgetCapRecord[] {
  const db = readDatabase();
  return db.budget_caps
    .filter((entry) => entry.trip_id === tripId)
    .map((entry) => ({ ...entry }));
}

export function getBudgetCap(
  tripId: string,
  category: BudgetCategoryId,
): BudgetCapRecord | null {
  const db = readDatabase();
  const cap = db.budget_caps.find(
    (entry) => entry.trip_id === tripId && entry.category === category,
  );
  return cloneBudgetCap(cap);
}

export function setBudgetCaps(
  tripId: string,
  caps: Array<{
    category: BudgetCategoryId;
    limit_amount: number;
    currency: string;
  }>,
): BudgetCapRecord[] {
  const now = new Date().toISOString();
  let createdCaps: BudgetCapRecord[] = [];

  updateDatabase((db) => {
    db.budget_caps = db.budget_caps.filter((cap) => cap.trip_id !== tripId);
    createdCaps = caps.map((cap) => ({
      id: crypto.randomUUID(),
      trip_id: tripId,
      category: cap.category,
      limit_amount: cap.limit_amount,
      currency: cap.currency,
      created_at: now,
      updated_at: now,
    }));
    db.budget_caps.push(...createdCaps);
  });

  return createdCaps.map((cap) => ({ ...cap }));
}
