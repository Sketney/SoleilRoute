import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { UserRecord } from "@/server/db/users";

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

export function createSession(userId: string) {
  const token = crypto.randomUUID();
  const expiresAt = getExpiryDate();
  const createdAt = new Date().toISOString();

  updateDatabase((db) => {
    db.sessions.push({
      token,
      user_id: userId,
      created_at: createdAt,
      expires_at: expiresAt,
    });
  });

  return { token, expiresAt };
}

export function deleteSession(token: string) {
  updateDatabase((db) => {
    db.sessions = db.sessions.filter((session) => session.token !== token);
  });
}

export function listSessionsByUser(userId: string): SessionRecord[] {
  const db = readDatabase();
  const now = Date.now();
  return db.sessions
    .filter((session) => session.user_id === userId)
    .filter((session) => new Date(session.expires_at).getTime() > now)
    .map((session) => ({ ...session }));
}

export function deleteSessionsByUser(userId: string, exceptToken?: string) {
  let removed = 0;
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

export function getSessionWithUser(
  token: string,
): (SessionRecord & { user: UserRecord }) | null {
  const db = readDatabase();
  const session = db.sessions.find((entry) => entry.token === token);

  if (!session) {
    return null;
  }

  const expired = new Date(session.expires_at).getTime() <= Date.now();
  if (expired) {
    deleteSession(token);
    return null;
  }

  const user = db.users.find((entry) => entry.id === session.user_id);
  if (!user) {
    deleteSession(token);
    return null;
  }

  return {
    ...session,
    user: { ...user },
  };
}
