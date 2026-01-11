import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";

export type NotificationRecord = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  action_url: string | null;
  created_at: string;
  read_at: string | null;
};

export function createNotification(
  userId: string,
  data: Omit<
    NotificationRecord,
    "id" | "user_id" | "created_at" | "read_at"
  >,
) {
  let created: NotificationRecord | null = null;

  updateDatabase((db) => {
    const user = db.users.find((entry) => entry.id === userId);
    const allowInApp = user?.notifications_in_app_enabled ?? true;
    if (!allowInApp) {
      return;
    }

    const record: NotificationRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      title: data.title,
      message: data.message,
      type: data.type ?? "info",
      action_url: data.action_url ?? null,
      created_at: new Date().toISOString(),
      read_at: null,
    };

    db.notifications.push(record);
    created = record;
  });

  if (!created) {
    return null;
  }
  return created;
}

export function listNotificationsByUser(userId: string, limit = 20) {
  const db = readDatabase();
  return db.notifications
    .filter((entry) => entry.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((entry) => ({ ...entry }));
}

export function markNotificationRead(notificationId: string) {
  updateDatabase((db) => {
    const target = db.notifications.find((entry) => entry.id === notificationId);
    if (target && !target.read_at) {
      target.read_at = new Date().toISOString();
    }
  });
}

export function markAllNotificationsRead(userId: string) {
  updateDatabase((db) => {
    const now = new Date().toISOString();
    db.notifications.forEach((entry) => {
      if (entry.user_id === userId && !entry.read_at) {
        entry.read_at = now;
      }
    });
  });
}
