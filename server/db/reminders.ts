import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";
import type { TimelineItemRecord } from "@/server/db/timeline";
import type { TripRecord } from "@/server/db/trips";

export type ReminderDeliveryRecord = {
  id: string;
  timeline_item_id: string;
  trip_id: string;
  user_id: string;
  notification_id: string | null;
  delivered_at: string;
  created_at: string;
};

export type DueReminderCandidateRecord = {
  timelineItem: TimelineItemRecord;
  trip: TripRecord;
};

export async function listDueReminderCandidates(
  nowIso: string,
  limit = 50,
): Promise<DueReminderCandidateRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.timeline_items
      .filter(
        (item) =>
          item.status === "pending" && item.type === "milestone" && item.due_date <= nowIso,
      )
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
      .slice(0, limit)
      .flatMap((item) => {
        const trip = db.trips.find((entry) => entry.id === item.trip_id);
        return trip ? [{ timelineItem: { ...item }, trip: { ...trip } }] : [];
      });
  }

  const { data: items, error } = await supabase
    .from("timeline_items")
    .select("*")
    .eq("status", "pending")
    .eq("type", "milestone")
    .lte("due_date", nowIso)
    .order("due_date", { ascending: true })
    .limit(limit);
  if (error || !items?.length) {
    return [];
  }

  const tripIds = Array.from(
    new Set(items.map((item) => String(item.trip_id)).filter(Boolean)),
  );
  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .in("id", tripIds);
  const tripsById = new Map(
    (trips ?? []).map((trip) => [String(trip.id), trip as TripRecord]),
  );

  return items.flatMap((item) => {
    const trip = tripsById.get(String(item.trip_id));
    return trip
      ? [{ timelineItem: item as TimelineItemRecord, trip: { ...trip } }]
      : [];
  });
}

export async function hasReminderDelivery(timelineItemId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return (db.reminder_deliveries ?? []).some(
      (entry) => entry.timeline_item_id === timelineItemId,
    );
  }

  const { data, error } = await supabase
    .from("reminder_deliveries")
    .select("id")
    .eq("timeline_item_id", timelineItemId)
    .limit(1)
    .maybeSingle();
  return !error && Boolean(data);
}

export async function createReminderDelivery(
  data: Omit<ReminderDeliveryRecord, "id" | "created_at">,
) {
  const record: ReminderDeliveryRecord = {
    id: crypto.randomUUID(),
    timeline_item_id: data.timeline_item_id,
    trip_id: data.trip_id,
    user_id: data.user_id,
    notification_id: data.notification_id ?? null,
    delivered_at: data.delivered_at,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.reminder_deliveries = db.reminder_deliveries ?? [];
      db.reminder_deliveries.push(record);
    });
    return { ...record };
  }

  const { data: created, error } = await supabase
    .from("reminder_deliveries")
    .insert(record)
    .select("*")
    .single();
  if (error || !created) {
    throw new Error("FAILED_TO_CREATE_REMINDER_DELIVERY");
  }
  return { ...(created as ReminderDeliveryRecord) };
}
