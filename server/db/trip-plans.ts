import crypto from "crypto";
import type { TripPlanSnapshot } from "@/lib/services/full-plan/types";
import type { TripPlanVisaScenario } from "@/lib/services/full-plan/visa-scenarios/types";
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

type TripPlanSnapshotWithLegacyScenarioFields = Omit<
  TripPlanSnapshot,
  "visaScenarios" | "activeVisaScenarioId"
> & {
  visaScenarios?: TripPlanVisaScenario[] | null;
  activeVisaScenarioId?: string | null;
};

function buildLegacyVisaScenario(
  snapshot: TripPlanSnapshotWithLegacyScenarioFields,
): TripPlanVisaScenario {
  return {
    id: "default",
    label: snapshot.visa.type?.trim() || "Entry requirements",
    isDefault: true,
    visa: snapshot.visa,
    documents: snapshot.documents,
    timeline: snapshot.timeline,
    reminders: snapshot.reminders,
  };
}

export function normalizeTripPlanSnapshot(
  snapshot: TripPlanSnapshotWithLegacyScenarioFields,
): TripPlanSnapshot {
  const fallbackScenario = buildLegacyVisaScenario(snapshot);
  const visaScenarios =
    snapshot.visaScenarios && snapshot.visaScenarios.length > 0
      ? snapshot.visaScenarios
      : [fallbackScenario];
  const activeVisaScenarioId =
    snapshot.activeVisaScenarioId &&
    visaScenarios.some((scenario) => scenario.id === snapshot.activeVisaScenarioId)
      ? snapshot.activeVisaScenarioId
      : (visaScenarios[0]?.id ?? null);
  const activeScenario =
    visaScenarios.find((scenario) => scenario.id === activeVisaScenarioId) ??
    fallbackScenario;

  return {
    ...snapshot,
    visaScenarios,
    activeVisaScenarioId,
    visa: activeScenario.visa,
    documents: activeScenario.documents,
    timeline: activeScenario.timeline,
    reminders: activeScenario.reminders,
  };
}

function clonePlan(record: TripPlanRecord) {
  return {
    ...record,
    plan_json: normalizeTripPlanSnapshot(
      structuredClone(record.plan_json) as TripPlanSnapshotWithLegacyScenarioFields,
    ),
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
