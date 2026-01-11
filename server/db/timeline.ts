import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";

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

export function listTimelineItems(tripId: string): TimelineItemRecord[] {
  const db = readDatabase();
  return db.timeline_items
    .filter((entry) => entry.trip_id === tripId)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .map((entry) => ({ ...entry }));
}

export function getTimelineItemById(itemId: string): TimelineItemRecord | null {
  const db = readDatabase();
  const item = db.timeline_items.find((entry) => entry.id === itemId);
  return cloneTimelineItem(item);
}

export function createTimelineItem(
  tripId: string,
  data: Omit<TimelineItemRecord, "id" | "trip_id" | "created_at" | "updated_at">,
): TimelineItemRecord {
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

  updateDatabase((db) => {
    db.timeline_items.push(record);
  });

  return { ...record };
}

export function updateTimelineItem(
  itemId: string,
  updates: Partial<
    Pick<
      TimelineItemRecord,
      "title" | "due_date" | "type" | "status" | "notes" | "amount" | "currency"
    >
  >,
): TimelineItemRecord | null {
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

export function deleteTimelineItem(itemId: string) {
  updateDatabase((db) => {
    db.timeline_items = db.timeline_items.filter(
      (entry) => entry.id !== itemId,
    );
  });
}
