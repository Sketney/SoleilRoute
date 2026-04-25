import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type TripEntitlementRecord = {
  id: string;
  user_id: string;
  trip_id: string;
  entitlement_type: "trip_pass" | "pro_subscription" | "admin_grant";
  status: "active" | "revoked" | "expired";
  source_purchase_id: string | null;
  granted_at: string;
  expires_at: string | null;
  created_at: string;
};

export type PurchaseRecord = {
  id: string;
  user_id: string;
  trip_id: string | null;
  product_type: "trip_pass" | "monthly_pro" | "annual_pro";
  provider: string;
  provider_checkout_id: string | null;
  provider_payment_id: string | null;
  status: "pending" | "paid" | "failed" | "refunded" | "cancelled";
  amount: number;
  currency: string;
  paid_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type SubscriptionRecord = {
  id: string;
  user_id: string;
  provider: string;
  provider_subscription_id: string | null;
  plan: "monthly_pro" | "annual_pro";
  status: "active" | "past_due" | "canceled" | "expired";
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

function cloneEntitlement(record: TripEntitlementRecord) {
  return { ...record };
}

function listJsonTripEntitlementsByUser(userId: string) {
  const db = readDatabase();
  return (db.trip_entitlements ?? [])
    .filter((entry) => entry.user_id === userId)
    .map(cloneEntitlement);
}

function listJsonActiveSubscriptionsByUser(userId: string) {
  const db = readDatabase();
  return (db.subscriptions ?? [])
    .filter((entry) => entry.user_id === userId && entry.status === "active")
    .map((entry) => ({ ...entry }));
}

export async function listTripEntitlementsByUser(userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return listJsonTripEntitlementsByUser(userId);
  }

  const { data, error } = await supabase
    .from("trip_entitlements")
    .select("*")
    .eq("user_id", userId);
  if (error || !data) {
    console.warn("Falling back to JSON trip entitlements", error);
    return listJsonTripEntitlementsByUser(userId);
  }
  return data.map((entry) => cloneEntitlement(entry as TripEntitlementRecord));
}

export async function listActiveSubscriptionsByUser(userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return listJsonActiveSubscriptionsByUser(userId);
  }

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active");
  if (error || !data) {
    console.warn("Falling back to JSON subscriptions", error);
    return listJsonActiveSubscriptionsByUser(userId);
  }
  return data.map((entry) => ({ ...(entry as SubscriptionRecord) }));
}

export async function createPurchase(
  data: Omit<PurchaseRecord, "id" | "created_at" | "updated_at">,
): Promise<PurchaseRecord> {
  const now = new Date().toISOString();
  const record: PurchaseRecord = {
    id: crypto.randomUUID(),
    ...data,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.purchases = db.purchases ?? [];
      const existing = db.purchases.find(
        (entry) =>
          entry.user_id === record.user_id &&
          entry.trip_id === record.trip_id &&
          entry.product_type === record.product_type &&
          entry.provider_payment_id === record.provider_payment_id,
      );
      if (!existing) {
        db.purchases.push(record);
      }
    });
    return { ...record };
  }

  const { data: created, error } = await supabase
    .from("purchases")
    .insert(record)
    .select("*")
    .single();
  if (error || !created) {
    console.warn("Falling back to JSON purchase storage", error);
    updateDatabase((db) => {
      db.purchases = db.purchases ?? [];
      db.purchases.push(record);
    });
    return record;
  }
  return { ...(created as PurchaseRecord) };
}

export async function createTripEntitlement(
  data: Omit<TripEntitlementRecord, "id" | "granted_at" | "created_at">,
): Promise<TripEntitlementRecord> {
  const now = new Date().toISOString();
  const record: TripEntitlementRecord = {
    id: crypto.randomUUID(),
    user_id: data.user_id,
    trip_id: data.trip_id,
    entitlement_type: data.entitlement_type,
    status: data.status,
    source_purchase_id: data.source_purchase_id ?? null,
    granted_at: now,
    expires_at: data.expires_at ?? null,
    created_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.trip_entitlements = db.trip_entitlements ?? [];
      const existing = db.trip_entitlements.find(
        (entry) =>
          entry.user_id === record.user_id &&
          entry.trip_id === record.trip_id &&
          entry.entitlement_type === record.entitlement_type,
      );
      if (existing) {
        existing.status = record.status;
        existing.source_purchase_id = record.source_purchase_id;
        existing.expires_at = record.expires_at;
      } else {
        db.trip_entitlements.push(record);
      }
    });
    return { ...record };
  }

  const { data: created, error } = await supabase
    .from("trip_entitlements")
    .upsert(record, {
      onConflict: "user_id,trip_id,entitlement_type",
    })
    .select("*")
    .single();
  if (error || !created) {
    console.warn("Falling back to JSON trip entitlement storage", error);
    updateDatabase((db) => {
      db.trip_entitlements = db.trip_entitlements ?? [];
      db.trip_entitlements.push(record);
    });
    return record;
  }
  return { ...(created as TripEntitlementRecord) };
}
