import type { NotificationRecord } from "@/server/db/notifications";
import type { TimelineItemRecord } from "@/server/db/timeline";
import type { TripRecord } from "@/server/db/trips";
import {
  createNotification,
  createReminderDelivery,
  hasReminderDelivery,
  listDueReminderCandidates,
} from "@/server/db";

export type ReminderCandidate = {
  timelineItem: TimelineItemRecord;
  trip: TripRecord;
};

export function shouldDeliverReminder(
  candidate: ReminderCandidate,
  now: Date,
  alreadyDelivered: boolean,
) {
  if (alreadyDelivered || candidate.timelineItem.status !== "pending") {
    return false;
  }
  return new Date(candidate.timelineItem.due_date).getTime() <= now.getTime();
}

export function buildReminderNotification(
  candidate: ReminderCandidate,
): Omit<NotificationRecord, "id" | "user_id" | "created_at" | "read_at"> {
  const dueDate = new Date(candidate.timelineItem.due_date)
    .toISOString()
    .slice(0, 10);
  return {
    title: `Trip reminder: ${candidate.timelineItem.title}`,
    message: `${candidate.trip.destination_country} task is due on ${dueDate}. ${candidate.timelineItem.notes ?? ""}`.trim(),
    type: "warning",
    action_url: `/dashboard/trips/${candidate.trip.id}`,
  };
}

export async function processDueReminders({
  now = new Date(),
  limit = 50,
}: {
  now?: Date;
  limit?: number;
} = {}) {
  const candidates = await listDueReminderCandidates(now.toISOString(), limit);
  let delivered = 0;
  const skipped: string[] = [];

  for (const candidate of candidates) {
    const alreadyDelivered = await hasReminderDelivery(candidate.timelineItem.id);
    if (!shouldDeliverReminder(candidate, now, alreadyDelivered)) {
      skipped.push(candidate.timelineItem.id);
      continue;
    }

    const notification = await createNotification(
      candidate.trip.user_id,
      buildReminderNotification(candidate),
    );
    await createReminderDelivery({
      timeline_item_id: candidate.timelineItem.id,
      trip_id: candidate.trip.id,
      user_id: candidate.trip.user_id,
      notification_id: notification?.id ?? null,
      delivered_at: now.toISOString(),
    });
    delivered += 1;
  }

  return {
    scanned: candidates.length,
    delivered,
    skipped,
  };
}
