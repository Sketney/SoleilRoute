import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type TripCollaboratorRole = "editor" | "viewer";

export type TripCollaboratorRecord = {
  id: string;
  trip_id: string;
  user_id: string;
  role: TripCollaboratorRole;
  added_by: string;
  created_at: string;
};

function normalizeRole(role: TripCollaboratorRole | undefined) {
  return role === "editor" ? "editor" : "viewer";
}

function cloneCollaborator(
  collaborator: TripCollaboratorRecord | undefined,
): TripCollaboratorRecord | null {
  return collaborator
    ? { ...collaborator, role: normalizeRole(collaborator.role) }
    : null;
}

export async function listTripCollaborators(
  tripId: string,
): Promise<TripCollaboratorRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.trip_collaborators
      .filter((entry) => entry.trip_id === tripId)
      .map((entry) => ({
        ...entry,
        role: normalizeRole(entry.role),
      }));
  }

  const { data, error } = await supabase
    .from("trip_collaborators")
    .select("*")
    .eq("trip_id", tripId);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({
    ...(entry as TripCollaboratorRecord),
    role: normalizeRole((entry as TripCollaboratorRecord).role),
  }));
}

export async function listCollaborationsByUser(
  userId: string,
): Promise<TripCollaboratorRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.trip_collaborators
      .filter((entry) => entry.user_id === userId)
      .map((entry) => ({
        ...entry,
        role: normalizeRole(entry.role),
      }));
  }

  const { data, error } = await supabase
    .from("trip_collaborators")
    .select("*")
    .eq("user_id", userId);
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({
    ...(entry as TripCollaboratorRecord),
    role: normalizeRole((entry as TripCollaboratorRecord).role),
  }));
}

export async function getTripCollaborator(
  tripId: string,
  userId: string,
): Promise<TripCollaboratorRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const collaborator = db.trip_collaborators.find(
      (entry) => entry.trip_id === tripId && entry.user_id === userId,
    );
    return cloneCollaborator(collaborator);
  }

  const { data, error } = await supabase
    .from("trip_collaborators")
    .select("*")
    .eq("trip_id", tripId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return cloneCollaborator(data as TripCollaboratorRecord);
}

export async function addTripCollaborator(
  tripId: string,
  userId: string,
  role: TripCollaboratorRole,
  addedBy: string,
): Promise<TripCollaboratorRecord> {
  const record: TripCollaboratorRecord = {
    id: crypto.randomUUID(),
    trip_id: tripId,
    user_id: userId,
    role: normalizeRole(role),
    added_by: addedBy,
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.trip_collaborators.push(record);
    });
    return { ...record };
  }

  const { data, error } = await supabase
    .from("trip_collaborators")
    .insert(record)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_ADD_COLLABORATOR");
  }

  return {
    ...(data as TripCollaboratorRecord),
    role: normalizeRole((data as TripCollaboratorRecord).role),
  };
}

export async function updateTripCollaboratorRole(
  tripId: string,
  userId: string,
  role: TripCollaboratorRole,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const target = db.trip_collaborators.find(
        (entry) => entry.trip_id === tripId && entry.user_id === userId,
      );
      if (!target) {
        return;
      }
      target.role = normalizeRole(role);
    });
    return;
  }

  await supabase
    .from("trip_collaborators")
    .update({ role: normalizeRole(role) })
    .eq("trip_id", tripId)
    .eq("user_id", userId);
}

export async function removeTripCollaborator(
  tripId: string,
  userId: string,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.trip_collaborators = db.trip_collaborators.filter(
        (entry) => !(entry.trip_id === tripId && entry.user_id === userId),
      );
    });
    return;
  }

  await supabase
    .from("trip_collaborators")
    .delete()
    .eq("trip_id", tripId)
    .eq("user_id", userId);
}
