import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import {
  canEditTrip,
  createNotification,
  createTimelineItem,
  deleteTimelineItem,
  getTimelineItemById,
  getTripAccess,
  listTimelineItems,
  updateTimelineItem,
} from "@/server/db";

const timelineSchema = z.object({
  title: z.string().min(1).max(120),
  dueDate: z.string(),
  type: z.enum(["milestone", "payment"]),
  status: z.enum(["pending", "completed"]).optional(),
  notes: z.string().max(500).nullable().optional(),
  amount: z.coerce.number().positive().nullable().optional(),
});

const updateTimelineSchema = timelineSchema.partial().extend({
  id: z.string(),
});

const deleteTimelineSchema = z.object({
  id: z.string(),
});

function toIsoDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toISOString();
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  const items = listTimelineItems(tripId);
  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      dueDate: item.due_date,
      type: item.type,
      status: item.status,
      notes: item.notes ?? null,
      amount: item.amount ?? null,
      currency: item.currency ?? null,
    })),
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!canEditTrip(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = timelineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const dueDate = toIsoDate(parsed.data.dueDate);
  if (!dueDate) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }

  const created = createTimelineItem(tripId, {
    title: parsed.data.title.trim(),
    due_date: dueDate,
    type: parsed.data.type,
    status: parsed.data.status ?? "pending",
    notes: parsed.data.notes?.trim() ? parsed.data.notes.trim() : null,
    amount: parsed.data.amount ?? null,
    currency: parsed.data.amount ? access.trip.currency : null,
  });

  createNotification(session.user.id, {
    title:
      created.type === "payment"
        ? "Payment reminder added"
        : "Timeline milestone added",
    message: `${created.title} due ${new Date(created.due_date).toDateString()}`,
    type: "info",
    action_url: `/dashboard/trips/${tripId}`,
  });

  return NextResponse.json(
    {
      item: {
        id: created.id,
        title: created.title,
        dueDate: created.due_date,
        type: created.type,
        status: created.status,
        notes: created.notes ?? null,
        amount: created.amount ?? null,
        currency: created.currency ?? null,
      },
    },
    { status: 201 },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!canEditTrip(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateTimelineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const item = getTimelineItemById(parsed.data.id);
  if (!item || item.trip_id !== tripId) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  const updates: {
    title?: string;
    due_date?: string;
    type?: "milestone" | "payment";
    status?: "pending" | "completed";
    notes?: string | null;
    amount?: number | null;
    currency?: string | null;
  } = {};

  if (parsed.data.title !== undefined) {
    updates.title = parsed.data.title.trim();
  }
  if (parsed.data.dueDate !== undefined) {
    const nextDate = toIsoDate(parsed.data.dueDate);
    if (!nextDate) {
      return NextResponse.json({ error: "Invalid date" }, { status: 400 });
    }
    updates.due_date = nextDate;
  }
  if (parsed.data.type !== undefined) {
    updates.type = parsed.data.type;
  }
  if (parsed.data.status !== undefined) {
    updates.status = parsed.data.status;
  }
  if (parsed.data.notes !== undefined) {
    updates.notes = parsed.data.notes?.trim() ? parsed.data.notes.trim() : null;
  }
  if (parsed.data.amount !== undefined) {
    updates.amount = parsed.data.amount ?? null;
    updates.currency = parsed.data.amount ? access.trip.currency : null;
  }

  const updated = updateTimelineItem(item.id, updates);
  if (!updated) {
    return NextResponse.json({ error: "Unable to update item" }, { status: 500 });
  }

  if (item.status !== "completed" && updated.status === "completed") {
    createNotification(session.user.id, {
      title:
        updated.type === "payment"
          ? "Payment marked complete"
          : "Milestone completed",
      message: updated.title,
      type: "success",
      action_url: `/dashboard/trips/${tripId}`,
    });
  }

  return NextResponse.json({
    item: {
      id: updated.id,
      title: updated.title,
      dueDate: updated.due_date,
      type: updated.type,
      status: updated.status,
      notes: updated.notes ?? null,
      amount: updated.amount ?? null,
      currency: updated.currency ?? null,
    },
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!canEditTrip(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = deleteTimelineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const item = getTimelineItemById(parsed.data.id);
  if (!item || item.trip_id !== tripId) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  deleteTimelineItem(item.id);

  return NextResponse.json({ success: true });
}
