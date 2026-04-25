import { describe, expect, it } from "vitest";
import {
  buildReminderNotification,
  shouldDeliverReminder,
  type ReminderCandidate,
} from "@/lib/services/reminders";

const candidate: ReminderCandidate = {
  timelineItem: {
    id: "timeline-1",
    trip_id: "trip-1",
    title: "Apply for eVisa",
    due_date: "2026-04-25T09:00:00.000Z",
    type: "milestone",
    status: "pending",
    notes: "Use official portal.",
    amount: null,
    currency: null,
    created_at: "2026-04-20T09:00:00.000Z",
    updated_at: "2026-04-20T09:00:00.000Z",
  },
  trip: {
    id: "trip-1",
    name: "Bali",
    destination_country: "Indonesia",
    destination_city: "Denpasar",
    start_date: "2026-05-10T00:00:00.000Z",
    end_date: "2026-05-20T00:00:00.000Z",
    total_budget: 1500,
    budget_tier: "mid",
    currency: "USD",
    citizenship: "USA",
    base_currency: "USD",
    exchange_rate: 1,
    notes: null,
    visa_status: "required",
    visa_last_checked: null,
    created_at: "2026-04-20T09:00:00.000Z",
  },
};

describe("reminders", () => {
  it("delivers only due pending timeline items without prior delivery", () => {
    expect(
      shouldDeliverReminder(candidate, new Date("2026-04-25T10:00:00.000Z"), false),
    ).toBe(true);
    expect(
      shouldDeliverReminder(candidate, new Date("2026-04-24T10:00:00.000Z"), false),
    ).toBe(false);
    expect(
      shouldDeliverReminder(candidate, new Date("2026-04-25T10:00:00.000Z"), true),
    ).toBe(false);
  });

  it("builds a notification with a stable trip action URL", () => {
    const notification = buildReminderNotification(candidate);

    expect(notification.title).toContain("Apply for eVisa");
    expect(notification.message).toContain("Indonesia");
    expect(notification.action_url).toBe("/dashboard/trips/trip-1");
    expect(notification.type).toBe("warning");
  });
});
