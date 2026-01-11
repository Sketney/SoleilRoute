import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { BudgetCategoryId } from "@/lib/constants";
import { getSupabaseAdmin } from "@/server/db/supabase";

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

export async function listBudgetCaps(
  tripId: string,
): Promise<BudgetCapRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.budget_caps
      .filter((entry) => entry.trip_id === tripId)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("budget_caps")
    .select("*")
    .eq("trip_id", tripId);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as BudgetCapRecord) }));
}

export async function getBudgetCap(
  tripId: string,
  category: BudgetCategoryId,
): Promise<BudgetCapRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const cap = db.budget_caps.find(
      (entry) => entry.trip_id === tripId && entry.category === category,
    );
    return cloneBudgetCap(cap);
  }

  const { data, error } = await supabase
    .from("budget_caps")
    .select("*")
    .eq("trip_id", tripId)
    .eq("category", category)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return cloneBudgetCap(data as BudgetCapRecord);
}

export async function setBudgetCaps(
  tripId: string,
  caps: Array<{
    category: BudgetCategoryId;
    limit_amount: number;
    currency: string;
  }>,
): Promise<BudgetCapRecord[]> {
  const now = new Date().toISOString();
  let createdCaps: BudgetCapRecord[] = [];

  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  createdCaps = caps.map((cap) => ({
    id: crypto.randomUUID(),
    trip_id: tripId,
    category: cap.category,
    limit_amount: cap.limit_amount,
    currency: cap.currency,
    created_at: now,
    updated_at: now,
  }));

  await supabase.from("budget_caps").delete().eq("trip_id", tripId);
  if (createdCaps.length) {
    const insertedCaps: BudgetCapRecord[] = [];
    for (const cap of createdCaps) {
      const { data, error } = await supabase
        .from("budget_caps")
        .insert(cap)
        .select("*")
        .single();
      if (error || !data) {
        return [];
      }
      insertedCaps.push(data as BudgetCapRecord);
    }
    return insertedCaps.map((cap) => ({ ...cap }));
  }

  return [];
}
