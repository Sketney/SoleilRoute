import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { UserRecord } from "@/server/db/users";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type SessionRecord = {
  token: string;
  user_id: string;
  created_at: string;
  expires_at: string;
};

const SESSION_TTL_DAYS = 30;

function getExpiryDate() {
  const expires = new Date();
  expires.setDate(expires.getDate() + SESSION_TTL_DAYS);
  return expires.toISOString();
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = getExpiryDate();
  const createdAt = new Date().toISOString();

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.sessions.push({
        token,
        user_id: userId,
        created_at: createdAt,
        expires_at: expiresAt,
      });
    });
  } else {
    await supabase.from("sessions").insert({
      token,
      user_id: userId,
      created_at: createdAt,
      expires_at: expiresAt,
    });
  }

  return { token, expiresAt };
}

export async function deleteSession(token: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.sessions = db.sessions.filter((session) => session.token !== token);
    });
    return;
  }

  await supabase.from("sessions").delete().eq("token", token);
}

export async function listSessionsByUser(
  userId: string,
): Promise<SessionRecord[]> {
  const now = Date.now();
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.sessions
      .filter((session) => session.user_id === userId)
      .filter((session) => new Date(session.expires_at).getTime() > now)
      .map((session) => ({ ...session }));
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId);
  if (error || !data) {
    return [];
  }
  return data
    .filter((session) => new Date(session.expires_at).getTime() > now)
    .map((session) => ({ ...session }));
}

export async function deleteSessionsByUser(
  userId: string,
  exceptToken?: string,
) {
  let removed = 0;
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.sessions = db.sessions.filter((session) => {
        if (session.user_id !== userId) {
          return true;
        }
        if (exceptToken && session.token === exceptToken) {
          return true;
        }
        removed += 1;
        return false;
      });
    });
    return removed;
  }

  const { data } = await supabase
    .from("sessions")
    .select("token")
    .eq("user_id", userId);
  if (data) {
    removed = data.filter(
      (session) => !(exceptToken && session.token === exceptToken),
    ).length;
  }
  let query = supabase.from("sessions").delete().eq("user_id", userId);
  if (exceptToken) {
    query = query.neq("token", exceptToken);
  }
  await query;

  return removed;
}

export async function getSessionWithUser(
  token: string,
): Promise<(SessionRecord & { user: UserRecord }) | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const session = db.sessions.find((entry) => entry.token === token);

    if (!session) {
      return null;
    }

    const expired = new Date(session.expires_at).getTime() <= Date.now();
    if (expired) {
      await deleteSession(token);
      return null;
    }

    const user = db.users.find((entry) => entry.id === session.user_id);
    if (!user) {
      await deleteSession(token);
      return null;
    }

    return {
      ...session,
      user: { ...user },
    };
  }

  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("token", token)
    .maybeSingle();
  if (error || !session) {
    return null;
  }
  const expired = new Date(session.expires_at).getTime() <= Date.now();
  if (expired) {
    await deleteSession(token);
    return null;
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user_id)
    .maybeSingle();
  if (!user) {
    await deleteSession(token);
    return null;
  }

  return {
    ...(session as SessionRecord),
    user: user as UserRecord,
  };
}
