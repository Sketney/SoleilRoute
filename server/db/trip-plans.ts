import crypto from "crypto";
import type { TripPlanSnapshot } from "@/lib/services/full-plan/types";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type TripPlanRecord = {
  id: string;
  trip_id: string;
  user_id: string;
  version: number;
  status: "preview" | "full";
  plan_json: TripPlanSnapshot;
  generated_at: string;
  visa_checked_at: string | null;
  created_at: string;
  updated_at: string;
};

function clonePlan(record: TripPlanRecord) {
  return {
    ...record,
    plan_json: structuredClone(record.plan_json),
  };
}

function getJsonTripPlan(tripId: string) {
  const db = readDatabase();
  const record = (db.trip_plans ?? [])
    .filter((entry) => entry.trip_id === tripId)
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  return record ? clonePlan(record) : null;
}

function upsertJsonTripPlan(record: TripPlanRecord) {
  updateDatabase((db) => {
    db.trip_plans = db.trip_plans ?? [];
    const index = db.trip_plans.findIndex(
      (entry) => entry.trip_id === record.trip_id,
    );
    if (index >= 0) {
      db.trip_plans[index] = record;
    } else {
      db.trip_plans.push(record);
    }
  });
}

export async function getTripPlan(tripId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return getJsonTripPlan(tripId);
  }

  const { data, error } = await supabase
    .from("trip_plans")
    .select("*")
    .eq("trip_id", tripId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    console.warn("Falling back to JSON trip plan lookup", error);
    return getJsonTripPlan(tripId);
  }
  return clonePlan(data as TripPlanRecord);
}

export async function upsertTripPlan(data: {
  trip_id: string;
  user_id: string;
  status: "preview" | "full";
  plan_json: TripPlanSnapshot;
  visa_checked_at: string | null;
}) {
  const now = new Date().toISOString();
  const existing = await getTripPlan(data.trip_id);
  const record: TripPlanRecord = {
    id: existing?.id ?? crypto.randomUUID(),
    trip_id: data.trip_id,
    user_id: data.user_id,
    version: (existing?.version ?? 0) + 1,
    status: data.status,
    plan_json: {
      ...data.plan_json,
      version: (existing?.version ?? 0) + 1,
    },
    generated_at: data.plan_json.generatedAt,
    visa_checked_at: data.visa_checked_at,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    upsertJsonTripPlan(record);
    return clonePlan(record);
  }

  const { data: created, error } = await supabase
    .from("trip_plans")
    .upsert(record, { onConflict: "trip_id" })
    .select("*")
    .single();
  if (error || !created) {
    console.warn("Falling back to JSON trip plan storage", error);
    upsertJsonTripPlan(record);
    return record;
  }
  return clonePlan(created as TripPlanRecord);
}
