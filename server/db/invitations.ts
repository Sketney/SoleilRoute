import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { TripCollaboratorRole } from "@/server/db/collaborators";
import { getSupabaseAdmin } from "@/server/db/supabase";

export type TripInvitationStatus = "pending" | "accepted" | "declined";

export type TripInvitationRecord = {
  id: string;
  trip_id: string;
  invitee_user_id: string;
  invitee_email: string;
  invited_by: string;
  role: TripCollaboratorRole;
  status: TripInvitationStatus;
  created_at: string;
  responded_at: string | null;
};

function cloneInvitation(
  invite: TripInvitationRecord | undefined,
): TripInvitationRecord | null {
  return invite ? { ...invite } : null;
}

export async function listInvitationsByUser(
  userId: string,
  status?: TripInvitationStatus,
): Promise<TripInvitationRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.trip_invitations
      .filter((entry) => entry.invitee_user_id === userId)
      .filter((entry) => (status ? entry.status === status : true))
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((entry) => ({ ...entry }));
  }

  let query = supabase
    .from("trip_invitations")
    .select("*")
    .eq("invitee_user_id", userId);
  if (status) {
    query = query.eq("status", status);
  }
  const { data, error } = await query.order("created_at", {
    ascending: false,
  });
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as TripInvitationRecord) }));
}

export async function listInvitationsByTrip(
  tripId: string,
): Promise<TripInvitationRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.trip_invitations
      .filter((entry) => entry.trip_id === tripId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .map((entry) => ({ ...entry }));
  }

  const { data, error } = await supabase
    .from("trip_invitations")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: false });
  if (error || !data) {
    return [];
  }
  return data.map((entry) => ({ ...(entry as TripInvitationRecord) }));
}

export async function getInvitationById(
  inviteId: string,
): Promise<TripInvitationRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const invite = db.trip_invitations.find((entry) => entry.id === inviteId);
    return cloneInvitation(invite);
  }

  const { data, error } = await supabase
    .from("trip_invitations")
    .select("*")
    .eq("id", inviteId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return cloneInvitation(data as TripInvitationRecord);
}

export async function createInvitation(
  tripId: string,
  inviteeUserId: string,
  inviteeEmail: string,
  invitedBy: string,
  role: TripCollaboratorRole,
): Promise<TripInvitationRecord> {
  const record: TripInvitationRecord = {
    id: crypto.randomUUID(),
    trip_id: tripId,
    invitee_user_id: inviteeUserId,
    invitee_email: inviteeEmail.toLowerCase(),
    invited_by: invitedBy,
    role,
    status: "pending",
    created_at: new Date().toISOString(),
    responded_at: null,
  };

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.trip_invitations.push(record);
    });
    return { ...record };
  }

  const { data, error } = await supabase
    .from("trip_invitations")
    .insert(record)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_CREATE_INVITE");
  }

  return { ...(data as TripInvitationRecord) };
}

export async function updateInvitationStatus(
  inviteId: string,
  status: TripInvitationStatus,
): Promise<TripInvitationRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    let updated: TripInvitationRecord | null = null;
    updateDatabase((db) => {
      const target = db.trip_invitations.find((entry) => entry.id === inviteId);
      if (!target) {
        return;
      }
      target.status = status;
      target.responded_at = new Date().toISOString();
      updated = { ...target };
    });
    return updated;
  }

  const { data, error } = await supabase
    .from("trip_invitations")
    .update({ status, responded_at: new Date().toISOString() })
    .eq("id", inviteId)
    .select("*")
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return { ...(data as TripInvitationRecord) };
}

export async function deleteInvitation(inviteId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.trip_invitations = db.trip_invitations.filter(
        (entry) => entry.id !== inviteId,
      );
    });
    return;
  }

  await supabase.from("trip_invitations").delete().eq("id", inviteId);
}
