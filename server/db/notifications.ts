import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

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

export async function createNotification(
  userId: string,
  data: Omit<
    NotificationRecord,
    "id" | "user_id" | "created_at" | "read_at"
  >,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const { data: user } = await supabase
    .from("users")
    .select("notifications_in_app_enabled")
    .eq("id", userId)
    .maybeSingle();
  if (user?.notifications_in_app_enabled === false) {
    return null;
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

  const { data: created, error } = await supabase
    .from("notifications")
    .insert(record)
    .select("*")
    .single();
  if (error || !created) {
    return null;
  }
  return { ...(created as NotificationRecord) };
}

export async function listNotificationsByUser(userId: string, limit = 20) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.notifications
      .filter((entry) => entry.user_id === userId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit)
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as NotificationRecord) }));
}

export async function markNotificationRead(notificationId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const target = db.notifications.find(
        (entry) => entry.id === notificationId,
      );
      if (target && !target.read_at) {
        target.read_at = new Date().toISOString();
      }
    });
    return;
  }

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const now = new Date().toISOString();
      db.notifications.forEach((entry) => {
        if (entry.user_id === userId && !entry.read_at) {
          entry.read_at = now;
        }
      });
    });
    return;
  }

  await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);
}
