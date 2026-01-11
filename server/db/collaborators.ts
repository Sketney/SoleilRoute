import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";

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

export function listTripCollaborators(tripId: string): TripCollaboratorRecord[] {
  const db = readDatabase();
  return db.trip_collaborators
    .filter((entry) => entry.trip_id === tripId)
    .map((entry) => ({
      ...entry,
      role: normalizeRole(entry.role),
    }));
}

export function listCollaborationsByUser(
  userId: string,
): TripCollaboratorRecord[] {
  const db = readDatabase();
  return db.trip_collaborators
    .filter((entry) => entry.user_id === userId)
    .map((entry) => ({
      ...entry,
      role: normalizeRole(entry.role),
    }));
}

export function getTripCollaborator(
  tripId: string,
  userId: string,
): TripCollaboratorRecord | null {
  const db = readDatabase();
  const collaborator = db.trip_collaborators.find(
    (entry) => entry.trip_id === tripId && entry.user_id === userId,
  );
  return cloneCollaborator(collaborator);
}

export function addTripCollaborator(
  tripId: string,
  userId: string,
  role: TripCollaboratorRole,
  addedBy: string,
): TripCollaboratorRecord {
  const record: TripCollaboratorRecord = {
    id: crypto.randomUUID(),
    trip_id: tripId,
    user_id: userId,
    role: normalizeRole(role),
    added_by: addedBy,
    created_at: new Date().toISOString(),
  };

  updateDatabase((db) => {
    db.trip_collaborators.push(record);
  });

  return { ...record };
}

export function updateTripCollaboratorRole(
  tripId: string,
  userId: string,
  role: TripCollaboratorRole,
) {
  updateDatabase((db) => {
    const target = db.trip_collaborators.find(
      (entry) => entry.trip_id === tripId && entry.user_id === userId,
    );
    if (!target) {
      return;
    }
    target.role = normalizeRole(role);
  });
}

export function removeTripCollaborator(tripId: string, userId: string) {
  updateDatabase((db) => {
    db.trip_collaborators = db.trip_collaborators.filter(
      (entry) => !(entry.trip_id === tripId && entry.user_id === userId),
    );
  });
}
