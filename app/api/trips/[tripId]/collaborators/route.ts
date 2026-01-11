import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import {
  createInvitation,
  createNotification,
  getTripAccess,
  getUserByEmail,
  getUserById,
  isTripOwner,
  listInvitationsByTrip,
  listTripCollaborators,
  removeTripCollaborator,
  updateTripCollaboratorRole,
} from "@/server/db";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["editor", "viewer"]),
});

const updateSchema = z.object({
  userId: z.string(),
  role: z.enum(["editor", "viewer"]),
});

const removeSchema = z.object({
  userId: z.string(),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ tripId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tripId } = await params;
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  const owner = await getUserById(access.trip.user_id);
  const collaborators = await listTripCollaborators(tripId);

  const payload = [
    {
      id: "owner",
      userId: access.trip.user_id,
      email: owner?.email ?? "owner",
      role: "owner",
      addedAt: access.trip.created_at,
    },
    ...(await Promise.all(
      collaborators.map(async (entry) => {
        const user = await getUserById(entry.user_id);
        return {
          id: entry.id,
          userId: entry.user_id,
          email: user?.email ?? "unknown",
          role: entry.role,
          addedAt: entry.created_at,
        };
      }),
    )),
  ];

  return NextResponse.json({ collaborators: payload });
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
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!isTripOwner(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const user = await getUserByEmail(parsed.data.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  if (user.id === access.trip.user_id) {
    return NextResponse.json({ error: "User already owns trip" }, { status: 400 });
  }

  const existing = (await listTripCollaborators(tripId)).find(
    (entry) => entry.user_id === user.id,
  );
  if (existing) {
    return NextResponse.json({ error: "Already added" }, { status: 409 });
  }

  const pendingInvite = (await listInvitationsByTrip(tripId)).find(
    (entry) =>
      entry.invitee_user_id === user.id && entry.status === "pending",
  );
  if (pendingInvite) {
    return NextResponse.json({ error: "Invite already pending" }, { status: 409 });
  }

  const invitation = await createInvitation(
    tripId,
    user.id,
    user.email,
    session.user.id,
    parsed.data.role,
  );

  await createNotification(user.id, {
    title: "Trip invitation received",
    message: `${session.user.email ?? "A teammate"} invited you to ${access.trip.name}.`,
    type: "info",
    action_url: "/dashboard/notifications",
  });

  return NextResponse.json(
    {
      invitation: {
        id: invitation.id,
        tripId: invitation.trip_id,
        userId: invitation.invitee_user_id,
        email: user.email,
        role: invitation.role,
        createdAt: invitation.created_at,
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
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!isTripOwner(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.userId === access.trip.user_id) {
    return NextResponse.json({ error: "Cannot edit owner role" }, { status: 400 });
  }

  await updateTripCollaboratorRole(tripId, parsed.data.userId, parsed.data.role);

  return NextResponse.json({ success: true });
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
  const access = await getTripAccess(tripId, session.user.id);
  if (!access) {
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }
  if (!isTripOwner(access.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = removeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.userId === access.trip.user_id) {
    return NextResponse.json({ error: "Cannot remove owner" }, { status: 400 });
  }

  await removeTripCollaborator(tripId, parsed.data.userId);

  return NextResponse.json({ success: true });
}
