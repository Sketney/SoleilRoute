import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { TripCollaboratorRole } from "@/server/db/collaborators";

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

export function listInvitationsByUser(
  userId: string,
  status?: TripInvitationStatus,
) {
  const db = readDatabase();
  return db.trip_invitations
    .filter((entry) => entry.invitee_user_id === userId)
    .filter((entry) => (status ? entry.status === status : true))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((entry) => ({ ...entry }));
}

export function listInvitationsByTrip(tripId: string) {
  const db = readDatabase();
  return db.trip_invitations
    .filter((entry) => entry.trip_id === tripId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((entry) => ({ ...entry }));
}

export function getInvitationById(inviteId: string): TripInvitationRecord | null {
  const db = readDatabase();
  const invite = db.trip_invitations.find((entry) => entry.id === inviteId);
  return cloneInvitation(invite);
}

export function createInvitation(
  tripId: string,
  inviteeUserId: string,
  inviteeEmail: string,
  invitedBy: string,
  role: TripCollaboratorRole,
): TripInvitationRecord {
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

  updateDatabase((db) => {
    db.trip_invitations.push(record);
  });

  return { ...record };
}

export function updateInvitationStatus(
  inviteId: string,
  status: TripInvitationStatus,
) {
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

export function deleteInvitation(inviteId: string) {
  updateDatabase((db) => {
    db.trip_invitations = db.trip_invitations.filter(
      (entry) => entry.id !== inviteId,
    );
  });
}
