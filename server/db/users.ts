import crypto from "crypto";
import { updateDatabase, readDatabase } from "@/server/db/client";

export type UserRecord = {
  id: string;
  email: string;
  password_hash: string;
  notifications_email_enabled: boolean;
  notifications_in_app_enabled: boolean;
  is_moderator?: boolean;
  display_name?: string;
  avatar_url?: string;
  created_at: string;
};

function cloneUser(user: UserRecord | undefined): UserRecord | null {
  if (!user) {
    return null;
  }
  return {
    ...user,
    notifications_email_enabled: user.notifications_email_enabled ?? true,
    notifications_in_app_enabled: user.notifications_in_app_enabled ?? true,
    is_moderator: user.is_moderator ?? false,
    display_name: user.display_name ?? "",
    avatar_url: user.avatar_url ?? "",
  };
}

export function getUserByEmail(email: string): UserRecord | null {
  const db = readDatabase();
  const user = db.users.find((entry) => entry.email === email.toLowerCase());
  return cloneUser(user);
}

export function getUserById(id: string): UserRecord | null {
  const db = readDatabase();
  const user = db.users.find((entry) => entry.id === id);
  return cloneUser(user);
}

export function createUser(email: string, passwordHash: string): UserRecord {
  const normalizedEmail = email.toLowerCase();
  let createdUser: UserRecord | null = null;

  updateDatabase((db) => {
    const existing = db.users.find((entry) => entry.email === normalizedEmail);
    if (existing) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const newUser: UserRecord = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password_hash: passwordHash,
      notifications_email_enabled: true,
      notifications_in_app_enabled: true,
      is_moderator: false,
      display_name: normalizedEmail.split("@")[0] ?? "",
      avatar_url: "",
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);
    createdUser = { ...newUser };
  });

  if (!createdUser) {
    throw new Error("FAILED_TO_CREATE_USER");
  }

  return createdUser;
}

export function updateUserEmail(userId: string, email: string): UserRecord {
  const normalizedEmail = email.toLowerCase();
  let updatedUser: UserRecord | null = null;

  updateDatabase((db) => {
    const existing = db.users.find((entry) => entry.email === normalizedEmail);
    if (existing && existing.id !== userId) {
      throw new Error("USER_ALREADY_EXISTS");
    }

    const target = db.users.find((entry) => entry.id === userId);
    if (!target) {
      throw new Error("USER_NOT_FOUND");
    }

    target.email = normalizedEmail;
    updatedUser = {
      ...target,
      notifications_email_enabled: target.notifications_email_enabled ?? true,
      notifications_in_app_enabled: target.notifications_in_app_enabled ?? true,
      is_moderator: target.is_moderator ?? false,
      display_name: target.display_name ?? "",
      avatar_url: target.avatar_url ?? "",
    };
  });

  if (!updatedUser) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }

  return updatedUser;
}

export function updateUserPassword(
  userId: string,
  passwordHash: string,
): UserRecord {
  let updatedUser: UserRecord | null = null;

  updateDatabase((db) => {
    const target = db.users.find((entry) => entry.id === userId);
    if (!target) {
      throw new Error("USER_NOT_FOUND");
    }

    target.password_hash = passwordHash;
    updatedUser = {
      ...target,
      notifications_email_enabled: target.notifications_email_enabled ?? true,
      notifications_in_app_enabled: target.notifications_in_app_enabled ?? true,
      is_moderator: target.is_moderator ?? false,
      display_name: target.display_name ?? "",
      avatar_url: target.avatar_url ?? "",
    };
  });

  if (!updatedUser) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }

  return updatedUser;
}

export function updateUserNotificationPreferences(
  userId: string,
  updates: {
    emailEnabled?: boolean;
    inAppEnabled?: boolean;
  },
): UserRecord {
  let updatedUser: UserRecord | null = null;

  updateDatabase((db) => {
    const target = db.users.find((entry) => entry.id === userId);
    if (!target) {
      throw new Error("USER_NOT_FOUND");
    }

    if (updates.emailEnabled !== undefined) {
      target.notifications_email_enabled = updates.emailEnabled;
    }
    if (updates.inAppEnabled !== undefined) {
      target.notifications_in_app_enabled = updates.inAppEnabled;
    }

    updatedUser = {
      ...target,
      notifications_email_enabled: target.notifications_email_enabled ?? true,
      notifications_in_app_enabled: target.notifications_in_app_enabled ?? true,
      is_moderator: target.is_moderator ?? false,
      display_name: target.display_name ?? "",
      avatar_url: target.avatar_url ?? "",
    };
  });

  if (!updatedUser) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }

  return updatedUser;
}

export function listUsers(): UserRecord[] {
  const db = readDatabase();
  return db.users.map((user) => ({
    ...user,
    notifications_email_enabled: user.notifications_email_enabled ?? true,
    notifications_in_app_enabled: user.notifications_in_app_enabled ?? true,
    is_moderator: user.is_moderator ?? false,
    display_name: user.display_name ?? "",
    avatar_url: user.avatar_url ?? "",
  }));
}

export function setUserModerator(userId: string, enabled: boolean): UserRecord {
  let updatedUser: UserRecord | null = null;

  updateDatabase((db) => {
    const target = db.users.find((entry) => entry.id === userId);
    if (!target) {
      throw new Error("USER_NOT_FOUND");
    }

    target.is_moderator = enabled;
    updatedUser = {
      ...target,
      notifications_email_enabled: target.notifications_email_enabled ?? true,
      notifications_in_app_enabled: target.notifications_in_app_enabled ?? true,
      is_moderator: target.is_moderator ?? false,
      display_name: target.display_name ?? "",
      avatar_url: target.avatar_url ?? "",
    };
  });

  if (!updatedUser) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }

  return updatedUser;
}

export function updateUserProfile(
  userId: string,
  updates: {
    displayName?: string;
    avatarUrl?: string;
  },
): UserRecord {
  let updatedUser: UserRecord | null = null;

  updateDatabase((db) => {
    const target = db.users.find((entry) => entry.id === userId);
    if (!target) {
      throw new Error("USER_NOT_FOUND");
    }

    if (updates.displayName !== undefined) {
      target.display_name = updates.displayName;
    }
    if (updates.avatarUrl !== undefined) {
      target.avatar_url = updates.avatarUrl;
    }

    updatedUser = {
      ...target,
      notifications_email_enabled: target.notifications_email_enabled ?? true,
      notifications_in_app_enabled: target.notifications_in_app_enabled ?? true,
      is_moderator: target.is_moderator ?? false,
      display_name: target.display_name ?? "",
      avatar_url: target.avatar_url ?? "",
    };
  });

  if (!updatedUser) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }

  return updatedUser;
}
