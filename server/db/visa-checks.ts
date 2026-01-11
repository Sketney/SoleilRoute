import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type VisaCheckRecord = {
  id: string;
  user_id: string;
  citizenship: string;
  destination: string;
  found: boolean;
  visa_required: boolean | null;
  visa_type: string | null;
  validity: string | null;
  processing_time: string | null;
  cost: number | null;
  currency: string | null;
  embassy_url: string | null;
  notes: string | null;
  source: string;
  checked_at: string;
};

export async function createVisaCheck(
  userId: string,
  data: Omit<VisaCheckRecord, "id" | "user_id" | "checked_at"> & {
    checked_at?: string;
  },
) {
  const record: VisaCheckRecord = {
    id: crypto.randomUUID(),
    user_id: userId,
    citizenship: data.citizenship,
    destination: data.destination,
    found: data.found,
    visa_required: data.visa_required ?? null,
    visa_type: data.visa_type ?? null,
    validity: data.validity ?? null,
    processing_time: data.processing_time ?? null,
    cost: data.cost ?? null,
    currency: data.currency ?? null,
    embassy_url: data.embassy_url ?? null,
    notes: data.notes ?? null,
    source: data.source,
    checked_at: data.checked_at ?? new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.visa_checks.push(record);
    });
    return { ...record };
  }

  const { data: created, error } = await supabase
    .from("visa_checks")
    .insert(record)
    .select("*")
    .single();
  if (error || !created) {
    throw new Error("FAILED_TO_CREATE_VISA_CHECK");
  }

  return { ...(created as VisaCheckRecord) };
}

export async function listVisaChecksByUser(userId: string, limit = 50) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.visa_checks
      .filter((entry) => entry.user_id === userId)
      .sort((a, b) => b.checked_at.localeCompare(a.checked_at))
      .slice(0, limit)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("visa_checks")
    .select("*")
    .eq("user_id", userId)
    .order("checked_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as VisaCheckRecord) }));
}

export async function getLatestVisaCheck(
  userId: string,
  citizenship: string,
  destination: string,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const match = db.visa_checks
      .filter(
        (entry) =>
          entry.user_id === userId &&
          entry.citizenship === citizenship &&
          entry.destination === destination,
      )
      .sort((a, b) => b.checked_at.localeCompare(a.checked_at))[0];
    return match ? { ...match } : null;
  }

  const { data, error } = await supabase
    .from("visa_checks")
    .select("*")
    .eq("user_id", userId)
    .eq("citizenship", citizenship)
    .eq("destination", destination)
    .order("checked_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { ...(data as VisaCheckRecord) };
}
