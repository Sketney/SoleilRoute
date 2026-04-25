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

export type VisaManualOverrideRecord = {
  id: string;
  citizenship: string;
  destination: string;
  visa_required: boolean;
  visa_type: string | null;
  validity: string | null;
  processing_time: string | null;
  cost: number | null;
  currency: string | null;
  embassy_url: string | null;
  application_url: string | null;
  passport_validity: string | null;
  notes: string | null;
  source_url: string | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type VisaIssueReportRecord = {
  id: string;
  user_id: string;
  trip_id: string | null;
  visa_check_id: string | null;
  citizenship: string;
  destination: string;
  issue: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  created_at: string;
  updated_at: string;
};

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

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

export async function listVisaChecks(limit = 100) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.visa_checks
      .sort((a, b) => b.checked_at.localeCompare(a.checked_at))
      .slice(0, limit)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("visa_checks")
    .select("*")
    .order("checked_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as VisaCheckRecord) }));
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

export async function getActiveVisaOverride(
  citizenship: string,
  destination: string,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const citizenshipKey = normalizeKey(citizenship);
    const destinationKey = normalizeKey(destination);
    const match = (db.visa_manual_overrides ?? [])
      .filter(
        (entry) =>
          entry.is_active &&
          normalizeKey(entry.citizenship) === citizenshipKey &&
          normalizeKey(entry.destination) === destinationKey,
      )
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
    return match ? { ...match } : null;
  }

  const { data, error } = await supabase
    .from("visa_manual_overrides")
    .select("*")
    .eq("citizenship", citizenship)
    .eq("destination", destination)
    .eq("is_active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { ...(data as VisaManualOverrideRecord) };
}

export async function createVisaManualOverride(
  createdBy: string,
  data: Omit<
    VisaManualOverrideRecord,
    "id" | "created_by" | "created_at" | "updated_at"
  >,
) {
  const now = new Date().toISOString();
  const record: VisaManualOverrideRecord = {
    id: crypto.randomUUID(),
    citizenship: data.citizenship,
    destination: data.destination,
    visa_required: data.visa_required,
    visa_type: data.visa_type ?? null,
    validity: data.validity ?? null,
    processing_time: data.processing_time ?? null,
    cost: data.cost ?? null,
    currency: data.currency ?? null,
    embassy_url: data.embassy_url ?? null,
    application_url: data.application_url ?? null,
    passport_validity: data.passport_validity ?? null,
    notes: data.notes ?? null,
    source_url: data.source_url ?? null,
    is_active: data.is_active,
    created_by: createdBy,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.visa_manual_overrides = db.visa_manual_overrides ?? [];
      db.visa_manual_overrides.forEach((entry) => {
        if (
          normalizeKey(entry.citizenship) === normalizeKey(record.citizenship) &&
          normalizeKey(entry.destination) === normalizeKey(record.destination)
        ) {
          entry.is_active = false;
          entry.updated_at = now;
        }
      });
      db.visa_manual_overrides.push(record);
    });
    return { ...record };
  }

  await supabase
    .from("visa_manual_overrides")
    .update({ is_active: false, updated_at: now })
    .eq("citizenship", record.citizenship)
    .eq("destination", record.destination);
  const { data: created, error } = await supabase
    .from("visa_manual_overrides")
    .insert(record)
    .select("*")
    .single();
  if (error || !created) {
    throw new Error("FAILED_TO_CREATE_VISA_OVERRIDE");
  }
  return { ...(created as VisaManualOverrideRecord) };
}

export async function listVisaManualOverrides(limit = 100) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return (db.visa_manual_overrides ?? [])
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, limit)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("visa_manual_overrides")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as VisaManualOverrideRecord) }));
}

export async function createVisaIssueReport(
  userId: string,
  data: Omit<
    VisaIssueReportRecord,
    "id" | "user_id" | "status" | "created_at" | "updated_at"
  >,
) {
  const now = new Date().toISOString();
  const record: VisaIssueReportRecord = {
    id: crypto.randomUUID(),
    user_id: userId,
    trip_id: data.trip_id ?? null,
    visa_check_id: data.visa_check_id ?? null,
    citizenship: data.citizenship,
    destination: data.destination,
    issue: data.issue,
    status: "open",
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.visa_issue_reports = db.visa_issue_reports ?? [];
      db.visa_issue_reports.push(record);
    });
    return { ...record };
  }

  const { data: created, error } = await supabase
    .from("visa_issue_reports")
    .insert(record)
    .select("*")
    .single();
  if (error || !created) {
    throw new Error("FAILED_TO_CREATE_VISA_ISSUE_REPORT");
  }
  return { ...(created as VisaIssueReportRecord) };
}

export async function listVisaIssueReports(limit = 100) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return (db.visa_issue_reports ?? [])
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("visa_issue_reports")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as VisaIssueReportRecord) }));
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
