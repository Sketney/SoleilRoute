import crypto from "crypto";
import { updateDatabase, readDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

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

function normalizeUser(user: UserRecord | null | undefined) {
  return cloneUser(user ?? undefined);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.toLowerCase();
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const user = db.users.find((entry) => entry.email === normalizedEmail);
    return normalizeUser(user);
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalizedEmail)
    .maybeSingle();
  if (error) {
    return null;
  }
  return normalizeUser(data as UserRecord | null);
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const user = db.users.find((entry) => entry.id === id);
    return normalizeUser(user);
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    return null;
  }
  return normalizeUser(data as UserRecord | null);
}

export async function createUser(
  email: string,
  passwordHash: string,
): Promise<UserRecord> {
  const normalizedEmail = email.toLowerCase();
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const { data, error } = await supabase
    .from("users")
    .insert(newUser)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_CREATE_USER");
  }
  return normalizeUser(data as UserRecord) as UserRecord;
}

export async function updateUserEmail(
  userId: string,
  email: string,
): Promise<UserRecord> {
  const normalizedEmail = email.toLowerCase();
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const { data, error } = await supabase
    .from("users")
    .update({ email: normalizedEmail })
    .eq("id", userId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }
  return normalizeUser(data as UserRecord) as UserRecord;
}

export async function updateUserPassword(
  userId: string,
  passwordHash: string,
): Promise<UserRecord> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const { data, error } = await supabase
    .from("users")
    .update({ password_hash: passwordHash })
    .eq("id", userId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }
  return normalizeUser(data as UserRecord) as UserRecord;
}

export async function updateUserNotificationPreferences(
  userId: string,
  updates: {
    emailEnabled?: boolean;
    inAppEnabled?: boolean;
  },
): Promise<UserRecord> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const payload: Partial<UserRecord> = {};
  if (updates.emailEnabled !== undefined) {
    payload.notifications_email_enabled = updates.emailEnabled;
  }
  if (updates.inAppEnabled !== undefined) {
    payload.notifications_in_app_enabled = updates.inAppEnabled;
  }
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }
  return normalizeUser(data as UserRecord) as UserRecord;
}

export async function listUsers(): Promise<UserRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const { data, error } = await supabase.from("users").select("*");
  if (error || !data) {
    return [];
  }
  return data.map((user) => normalizeUser(user as UserRecord)) as UserRecord[];
}

export async function setUserModerator(
  userId: string,
  enabled: boolean,
): Promise<UserRecord> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const { data, error } = await supabase
    .from("users")
    .update({ is_moderator: enabled })
    .eq("id", userId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }
  return normalizeUser(data as UserRecord) as UserRecord;
}

export async function updateUserProfile(
  userId: string,
  updates: {
    displayName?: string;
    avatarUrl?: string;
  },
): Promise<UserRecord> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

  const payload: Partial<UserRecord> = {};
  if (updates.displayName !== undefined) {
    payload.display_name = updates.displayName;
  }
  if (updates.avatarUrl !== undefined) {
    payload.avatar_url = updates.avatarUrl;
  }
  const { data, error } = await supabase
    .from("users")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_UPDATE_USER");
  }
  return normalizeUser(data as UserRecord) as UserRecord;
}
