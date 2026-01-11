import crypto from "crypto";
import { readDatabase, updateDatabase } from "@/server/db/client";
import type { VisaStatus } from "@/lib/constants";
import type { BudgetTier } from "@/lib/budget-planner-data";
import type { TripCollaboratorRole } from "@/server/db/collaborators";
import { getSupabaseAdmin } from "@/server/db/supabase";

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
  is_paid: boolean;
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

function normalizeTrip(trip: TripRecord | undefined | null): TripRecord | null {
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

function normalizeBudgetItem(
  item: BudgetItemRecord | undefined | null,
): BudgetItemRecord | null {
  if (!item) {
    return null;
  }
  return {
    ...item,
    is_paid: Boolean(item.is_paid),
  };
}

export async function listTripsWithAccess(
  userId: string,
): Promise<TripAccess[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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
        trip: normalizeTrip(trip) as TripRecord,
        role: accessByTrip.get(trip.id) ?? "viewer",
      }));
  }

  const { data: ownedTrips } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", userId);
  const { data: collaborations } = await supabase
    .from("trip_collaborators")
    .select("*")
    .eq("user_id", userId);

  const accessByTrip = new Map<string, TripAccessRole>();
  (ownedTrips ?? []).forEach((trip) => {
    accessByTrip.set(trip.id as string, "owner");
  });
  (collaborations ?? []).forEach((entry) => {
    if (!accessByTrip.has(entry.trip_id as string)) {
      accessByTrip.set(
        entry.trip_id as string,
        entry.role === "editor" ? "editor" : "viewer",
      );
    }
  });

  const collabTripIds = (collaborations ?? []).map(
    (entry) => entry.trip_id as string,
  );
  const tripsByCollab =
    collabTripIds.length > 0
      ? await supabase
          .from("trips")
          .select("*")
          .in("id", collabTripIds)
      : { data: [] as TripRecord[] };

  const allTrips = [...(ownedTrips ?? []), ...(tripsByCollab.data ?? [])];
  return allTrips
    .filter((trip) => accessByTrip.has(trip.id as string))
    .sort((a, b) =>
      String(a.start_date).localeCompare(String(b.start_date)),
    )
    .map((trip) => ({
      trip: normalizeTrip(trip as TripRecord) as TripRecord,
      role: accessByTrip.get(trip.id as string) ?? "viewer",
    }));
}

export async function listTripsByUser(userId: string): Promise<TripRecord[]> {
  const access = await listTripsWithAccess(userId);
  return access.map((entry) => entry.trip);
}

export async function getTripById(tripId: string): Promise<TripRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const trip = db.trips.find((entry) => entry.id === tripId);
    return normalizeTrip(trip);
  }

  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .maybeSingle();
  if (error) {
    return null;
  }
  return normalizeTrip(data as TripRecord | null);
}

export async function getTripAccess(
  tripId: string,
  userId: string,
): Promise<TripAccess | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const trip = db.trips.find((entry) => entry.id === tripId);
    if (!trip) {
      return null;
    }

    if (trip.user_id === userId) {
      return {
        trip: normalizeTrip(trip) as TripRecord,
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
      trip: normalizeTrip(trip) as TripRecord,
      role: collaborator.role === "editor" ? "editor" : "viewer",
    };
  }

  const { data: trip } = await supabase
    .from("trips")
    .select("*")
    .eq("id", tripId)
    .maybeSingle();
  if (!trip) {
    return null;
  }

  if ((trip.user_id as string) === userId) {
    return {
      trip: normalizeTrip(trip as TripRecord) as TripRecord,
      role: "owner",
    };
  }

  const { data: collaborator } = await supabase
    .from("trip_collaborators")
    .select("*")
    .eq("trip_id", tripId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!collaborator) {
    return null;
  }

  return {
    trip: normalizeTrip(trip as TripRecord) as TripRecord,
    role: collaborator.role === "editor" ? "editor" : "viewer",
  };
}

export async function getLatestTripByUser(
  userId: string,
): Promise<TripRecord | null> {
  const trips = await listTripsWithAccess(userId);
  const latest = trips.sort((a, b) =>
    b.trip.created_at.localeCompare(a.trip.created_at),
  )[0];
  return latest ? { ...latest.trip } : null;
}

export async function createTrip(
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

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.trips.push(newTrip);
    });
    return { ...newTrip };
  }

  const { data, error } = await supabase
    .from("trips")
    .insert(newTrip)
    .select("*")
    .single();
  if (error || !data) {
    throw new Error("FAILED_TO_CREATE_TRIP");
  }
  return normalizeTrip(data as TripRecord) as TripRecord;
}

export async function updateTrip(
  tripId: string,
  updates: Partial<Omit<TripRecord, "id" | "user_id" | "created_at">>,
): Promise<TripRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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

      updatedTrip = normalizeTrip(trip);
    });

    return updatedTrip;
  }

  if (updates.currency) {
    await supabase
      .from("budget_items")
      .update({ currency: updates.currency })
      .eq("trip_id", tripId);
    await supabase
      .from("budget_caps")
      .update({ currency: updates.currency })
      .eq("trip_id", tripId);
  }

  const { data, error } = await supabase
    .from("trips")
    .update(updates)
    .eq("id", tripId)
    .select("*")
    .single();
  if (error || !data) {
    return null;
  }
  return normalizeTrip(data as TripRecord);
}

export async function deleteTrip(tripId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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
    return;
  }

  await supabase.from("trips").delete().eq("id", tripId);
  await supabase.from("budget_items").delete().eq("trip_id", tripId);
  await supabase.from("budget_caps").delete().eq("trip_id", tripId);
  await supabase.from("timeline_items").delete().eq("trip_id", tripId);
  await supabase.from("trip_collaborators").delete().eq("trip_id", tripId);
  await supabase.from("trip_invitations").delete().eq("trip_id", tripId);
}

export async function insertBudgetItem(
  tripId: string,
  item: Omit<BudgetItemRecord, "id" | "trip_id" | "created_at" | "is_paid"> & {
    is_paid?: boolean;
  },
) {
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const isPaid = Boolean(item.is_paid);

  const supabase = getSupabaseAdmin();
  if (!supabase) {
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
      } as BudgetItemRecord);
    });
    return id;
  }

  await supabase.from("budget_items").insert({
    id,
    trip_id: tripId,
    category: item.category,
    description: item.description ?? null,
    amount: item.amount,
    currency: item.currency,
    is_paid: isPaid,
    created_at: createdAt,
  });
  return id;
}

export async function getBudgetItemById(
  itemId: string,
): Promise<BudgetItemRecord | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    const item = db.budget_items.find((entry) => entry.id === itemId);
    return normalizeBudgetItem(item as BudgetItemRecord | null);
  }

  const { data, error } = await supabase
    .from("budget_items")
    .select("*")
    .eq("id", itemId)
    .maybeSingle();
  if (error || !data) {
    return null;
  }
  return normalizeBudgetItem(data as BudgetItemRecord);
}

export async function listBudgetItems(
  tripId: string,
): Promise<BudgetItemRecord[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    const db = readDatabase();
    return db.budget_items
      .filter((entry) => entry.trip_id === tripId)
      .sort((a, b) => a.created_at.localeCompare(b.created_at))
      .map((entry) => normalizeBudgetItem(entry as BudgetItemRecord) as BudgetItemRecord);
  }

  const { data, error } = await supabase
    .from("budget_items")
    .select("*")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });
  if (error || !data) {
    return [];
  }
  return data.map((entry) => normalizeBudgetItem(entry as BudgetItemRecord) as BudgetItemRecord);
}

export async function updateBudgetItemStatus(
  itemId: string,
  isPaid: boolean,
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      const target = db.budget_items.find((entry) => entry.id === itemId);
      if (target) {
        target.is_paid = isPaid;
      }
    });
    return;
  }

  await supabase
    .from("budget_items")
    .update({ is_paid: isPaid })
    .eq("id", itemId);
}

export async function updateBudgetItem(
  itemId: string,
  updates: {
    category?: string;
    description?: string | null;
    amount?: number;
    currency?: string;
    is_paid?: boolean;
  },
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
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
        target.is_paid = updates.is_paid;
      }
    });
    return;
  }

  await supabase.from("budget_items").update(updates).eq("id", itemId);
}

export async function deleteBudgetItem(itemId: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    updateDatabase((db) => {
      db.budget_items = db.budget_items.filter((entry) => entry.id !== itemId);
    });
    return;
  }

  await supabase.from("budget_items").delete().eq("id", itemId);
}
