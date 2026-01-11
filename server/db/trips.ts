import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { VisaStatus } from "@/lib/constants";
import type { BudgetTier } from "@/lib/budget-planner-data";
import type { TripCollaboratorRole } from "@/server/db/collaborators";

export type TripRecord = {
  id: string;
  user_id: string;
  name: string;
  destination_country: string;
  destination_city: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  budget_tier: BudgetTier;
  currency: string;
  citizenship: string;
  base_currency: string;
  exchange_rate: number | null;
  notes: string | null;
  visa_status: VisaStatus;
  visa_last_checked: string | null;
  created_at: string;
};

export type BudgetItemRecord = {
  id: string;
  trip_id: string;
  category: string;
  description: string | null;
  amount: number;
  currency: string;
  is_paid: number;
  created_at: string;
};

export type TripAccessRole = "owner" | TripCollaboratorRole;

export type TripAccess = {
  trip: TripRecord;
  role: TripAccessRole;
};

export function canEditTrip(role: TripAccessRole) {
  return role === "owner" || role === "editor";
}

export function isTripOwner(role: TripAccessRole) {
  return role === "owner";
}

function cloneTrip(trip: TripRecord | undefined): TripRecord | null {
  if (!trip) {
    return null;
  }
  return {
    ...trip,
    notes: trip.notes ?? null,
    budget_tier: trip.budget_tier ?? "mid",
    visa_status: trip.visa_status ?? "unknown",
    visa_last_checked: trip.visa_last_checked ?? null,
  };
}

function cloneBudgetItem(
  item: BudgetItemRecord | undefined,
): BudgetItemRecord | null {
  return item ? { ...item } : null;
}

export function listTripsWithAccess(userId: string): TripAccess[] {
  const db = readDatabase();
  const accessByTrip = new Map<string, TripAccessRole>();

  db.trips.forEach((trip) => {
    if (trip.user_id === userId) {
      accessByTrip.set(trip.id, "owner");
    }
  });

  db.trip_collaborators.forEach((collaborator) => {
    if (
      collaborator.user_id === userId &&
      !accessByTrip.has(collaborator.trip_id)
    ) {
      accessByTrip.set(
        collaborator.trip_id,
        collaborator.role === "editor" ? "editor" : "viewer",
      );
    }
  });

  return db.trips
    .filter((trip) => accessByTrip.has(trip.id))
    .sort((a, b) => a.start_date.localeCompare(b.start_date))
    .map((trip) => ({
      trip: {
        ...trip,
        notes: trip.notes ?? null,
        budget_tier: trip.budget_tier ?? "mid",
        visa_status: trip.visa_status ?? "unknown",
        visa_last_checked: trip.visa_last_checked ?? null,
      },
      role: accessByTrip.get(trip.id) ?? "viewer",
    }));
}

export function listTripsByUser(userId: string): TripRecord[] {
  return listTripsWithAccess(userId).map((entry) => entry.trip);
}

export function getTripById(tripId: string): TripRecord | null {
  const db = readDatabase();
  const trip = db.trips.find((entry) => entry.id === tripId);
  return cloneTrip(trip);
}

export function getTripAccess(
  tripId: string,
  userId: string,
): TripAccess | null {
  const db = readDatabase();
  const trip = db.trips.find((entry) => entry.id === tripId);
  if (!trip) {
    return null;
  }

  if (trip.user_id === userId) {
    return {
      trip: {
        ...trip,
        notes: trip.notes ?? null,
        budget_tier: trip.budget_tier ?? "mid",
        visa_status: trip.visa_status ?? "unknown",
        visa_last_checked: trip.visa_last_checked ?? null,
      },
      role: "owner",
    };
  }

  const collaborator = db.trip_collaborators.find(
    (entry) => entry.trip_id === tripId && entry.user_id === userId,
  );
  if (!collaborator) {
    return null;
  }

  return {
    trip: {
      ...trip,
      notes: trip.notes ?? null,
      budget_tier: trip.budget_tier ?? "mid",
      visa_status: trip.visa_status ?? "unknown",
      visa_last_checked: trip.visa_last_checked ?? null,
    },
    role: collaborator.role === "editor" ? "editor" : "viewer",
  };
}

export function getLatestTripByUser(userId: string): TripRecord | null {
  const trips = listTripsWithAccess(userId);
  const latest = trips.sort((a, b) =>
    b.trip.created_at.localeCompare(a.trip.created_at),
  )[0];
  return latest ? { ...latest.trip } : null;
}

export function createTrip(
  userId: string,
  data: Omit<TripRecord, "id" | "user_id" | "created_at">,
) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const newTrip: TripRecord = {
    id,
    user_id: userId,
    name: data.name,
    destination_country: data.destination_country,
    destination_city: data.destination_city,
    start_date: data.start_date,
    end_date: data.end_date,
    total_budget: data.total_budget,
    budget_tier: data.budget_tier ?? "mid",
    currency: data.currency,
    citizenship: data.citizenship,
    base_currency: data.base_currency,
    exchange_rate: data.exchange_rate,
    notes: data.notes ?? null,
    visa_status: data.visa_status ?? "unknown",
    visa_last_checked: data.visa_last_checked ?? null,
    created_at: createdAt,
  };

  updateDatabase((db) => {
    db.trips.push(newTrip);
  });

  return { ...newTrip };
}

export function updateTrip(
  tripId: string,
  updates: Partial<Omit<TripRecord, "id" | "user_id" | "created_at">>,
): TripRecord | null {
  let updatedTrip: TripRecord | null = null;

  updateDatabase((db) => {
    const trip = db.trips.find((entry) => entry.id === tripId);
    if (!trip) {
      return;
    }

    if (updates.name !== undefined) {
      trip.name = updates.name;
    }
    if (updates.destination_country !== undefined) {
      trip.destination_country = updates.destination_country;
    }
    if (updates.destination_city !== undefined) {
      trip.destination_city = updates.destination_city;
    }
    if (updates.start_date !== undefined) {
      trip.start_date = updates.start_date;
    }
    if (updates.end_date !== undefined) {
      trip.end_date = updates.end_date;
    }
    if (updates.total_budget !== undefined) {
      trip.total_budget = updates.total_budget;
    }
    if (updates.budget_tier !== undefined) {
      trip.budget_tier = updates.budget_tier;
    }
    if (updates.currency !== undefined) {
      const nextCurrency = updates.currency;
      trip.currency = nextCurrency;
      db.budget_items = db.budget_items.map((item) =>
        item.trip_id === tripId ? { ...item, currency: nextCurrency } : item,
      );
      db.budget_caps = db.budget_caps.map((cap) =>
        cap.trip_id === tripId ? { ...cap, currency: nextCurrency } : cap,
      );
    }
    if (updates.citizenship !== undefined) {
      trip.citizenship = updates.citizenship;
    }
    if (updates.base_currency !== undefined) {
      trip.base_currency = updates.base_currency;
    }
    if (updates.exchange_rate !== undefined) {
      trip.exchange_rate = updates.exchange_rate;
    }
    if (updates.notes !== undefined) {
      trip.notes = updates.notes;
    }
    if (updates.visa_status !== undefined) {
      trip.visa_status = updates.visa_status;
    }
    if (updates.visa_last_checked !== undefined) {
      trip.visa_last_checked = updates.visa_last_checked;
    }

    updatedTrip = {
      ...trip,
      notes: trip.notes ?? null,
      budget_tier: trip.budget_tier ?? "mid",
      visa_status: trip.visa_status ?? "unknown",
      visa_last_checked: trip.visa_last_checked ?? null,
    };
  });

  return updatedTrip;
}

export function deleteTrip(tripId: string) {
  updateDatabase((db) => {
    db.trips = db.trips.filter((trip) => trip.id !== tripId);
    db.budget_items = db.budget_items.filter(
      (item) => item.trip_id !== tripId,
    );
    db.budget_caps = db.budget_caps.filter((cap) => cap.trip_id !== tripId);
    db.timeline_items = db.timeline_items.filter(
      (entry) => entry.trip_id !== tripId,
    );
    db.trip_collaborators = db.trip_collaborators.filter(
      (entry) => entry.trip_id !== tripId,
    );
    db.trip_invitations = db.trip_invitations.filter(
      (entry) => entry.trip_id !== tripId,
    );
  });
}

export function insertBudgetItem(
  tripId: string,
  item: Omit<BudgetItemRecord, "id" | "trip_id" | "created_at" | "is_paid"> & {
    is_paid?: boolean;
  },
) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const isPaid = item.is_paid ? 1 : 0;

  updateDatabase((db) => {
    db.budget_items.push({
      id,
      trip_id: tripId,
      category: item.category,
      description: item.description ?? null,
      amount: item.amount,
      currency: item.currency,
      is_paid: isPaid,
      created_at: createdAt,
    });
  });

  return id;
}

export function getBudgetItemById(itemId: string): BudgetItemRecord | null {
  const db = readDatabase();
  const item = db.budget_items.find((entry) => entry.id === itemId);
  return cloneBudgetItem(item);
}

export function listBudgetItems(tripId: string): BudgetItemRecord[] {
  const db = readDatabase();
  return db.budget_items
    .filter((entry) => entry.trip_id === tripId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((entry) => ({ ...entry }));
}

export function updateBudgetItemStatus(itemId: string, isPaid: boolean) {
  updateDatabase((db) => {
    const target = db.budget_items.find((entry) => entry.id === itemId);
    if (target) {
      target.is_paid = isPaid ? 1 : 0;
    }
  });
}

export function updateBudgetItem(
  itemId: string,
  updates: {
    category?: string;
    description?: string | null;
    amount?: number;
    currency?: string;
    is_paid?: boolean;
  },
) {
  updateDatabase((db) => {
    const target = db.budget_items.find((entry) => entry.id === itemId);
    if (!target) {
      return;
    }
    if (updates.category) {
      target.category = updates.category;
    }
    if (updates.description !== undefined) {
      target.description = updates.description;
    }
    if (updates.amount !== undefined) {
      target.amount = updates.amount;
    }
    if (updates.currency) {
      target.currency = updates.currency;
    }
    if (updates.is_paid !== undefined) {
      target.is_paid = updates.is_paid ? 1 : 0;
    }
  });
}

export function deleteBudgetItem(itemId: string) {
  updateDatabase((db) => {
    db.budget_items = db.budget_items.filter((entry) => entry.id !== itemId);
  });
}
