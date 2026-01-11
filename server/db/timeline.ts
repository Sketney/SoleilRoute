import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type TimelineItemType = "milestone" | "payment";
export type TimelineItemStatus = "pending" | "completed";

export type TimelineItemRecord = {
  id: string;
  trip_id: string;
  title: string;
  due_date: string;
  type: TimelineItemType;
  status: TimelineItemStatus;
  notes: string | null;
  amount: number | null;
  currency: string | null;
  created_at: string;
  updated_at: string;
};

function cloneTimelineItem(
  item: TimelineItemRecord | undefined,
): TimelineItemRecord | null {
  return item ? { ...item } : null;
}

export async function listTimelineItems(
  tripId: string,
): Promise<TimelineItemRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.timeline_items
      .filter((entry) => entry.trip_id === tripId)
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("timeline_items")
    .select("*")
    .eq("trip_id", tripId)
    .order("due_date", { ascending: true });
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as TimelineItemRecord) }));
}

export async function getTimelineItemById(
  itemId: string,
): Promise<TimelineItemRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const item = db.timeline_items.find((entry) => entry.id === itemId);
    return cloneTimelineItem(item);
  }

  const { data, error } = await supabase
    .from("timeline_items")
    .select("*")
    .eq("id", itemId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return cloneTimelineItem(data as TimelineItemRecord);
}

export async function createTimelineItem(
  tripId: string,
  data: Omit<TimelineItemRecord, "id" | "trip_id" | "created_at" | "updated_at">,
): Promise<TimelineItemRecord> {
  const now = new Date().toISOString();
  const record: TimelineItemRecord = {
    id: crypto.randomUUID(),
    trip_id: tripId,
    title: data.title,
    due_date: data.due_date,
    type: data.type,
    status: data.status,
    notes: data.notes ?? null,
    amount: data.amount ?? null,
    currency: data.currency ?? null,
    created_at: now,
    updated_at: now,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.timeline_items.push(record);
    });
    return { ...record };
  }

  const { data: created, error } = await supabase
    .from("timeline_items")
    .insert(record)
    .select("*")
    .single();
  if (error || !created) {
    throw new Error("FAILED_TO_CREATE_TIMELINE_ITEM");
  }

  return { ...(created as TimelineItemRecord) };
}

export async function updateTimelineItem(
  itemId: string,
  updates: Partial<
    Pick<
      TimelineItemRecord,
      "title" | "due_date" | "type" | "status" | "notes" | "amount" | "currency"
    >
  >,
): Promise<TimelineItemRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    let updated: TimelineItemRecord | null = null;
    updateDatabase((db) => {
      const target = db.timeline_items.find((entry) => entry.id === itemId);
      if (!target) {
        return;
      }
      if (updates.title !== undefined) {
        target.title = updates.title;
      }
      if (updates.due_date !== undefined) {
        target.due_date = updates.due_date;
      }
      if (updates.type !== undefined) {
        target.type = updates.type;
      }
      if (updates.status !== undefined) {
        target.status = updates.status;
      }
      if (updates.notes !== undefined) {
        target.notes = updates.notes;
      }
      if (updates.amount !== undefined) {
        target.amount = updates.amount;
      }
      if (updates.currency !== undefined) {
        target.currency = updates.currency;
      }

      target.updated_at = new Date().toISOString();
      updated = { ...target };
    });

    return updated;
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from("timeline_items")
    .update(payload)
    .eq("id", itemId)
    .select("*")
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { ...(data as TimelineItemRecord) };
}

export async function deleteTimelineItem(itemId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.timeline_items = db.timeline_items.filter(
        (entry) => entry.id !== itemId,
      );
    });
    return;
  }

  await supabase.from("timeline_items").delete().eq("id", itemId);
}
