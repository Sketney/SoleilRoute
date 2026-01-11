import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "@/lib/auth/session";
import {
  addTripCollaborator,
  createNotification,
  getInvitationById,
  getTripAccess,
  getTripById,
  getUserById,
  updateInvitationStatus,
} from "@/server/db";

const respondSchema = z.object({
  action: z.enum(["accept", "decline"]),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ inviteId: string }> },
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inviteId } = await params;
  const invitation = getInvitationById(inviteId);
  if (!invitation || invitation.invitee_user_id !== session.user.id) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = respondSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (invitation.status !== "pending") {
    return NextResponse.json({ error: "Invitation already handled" }, { status: 409 });
  }

  const trip = getTripById(invitation.trip_id);
  if (!trip) {
    updateInvitationStatus(invitation.id, "declined");
    return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  }

  if (parsed.data.action === "accept") {
    const existingAccess = getTripAccess(invitation.trip_id, session.user.id);
    if (!existingAccess) {
      addTripCollaborator(
        invitation.trip_id,
        session.user.id,
        invitation.role,
        invitation.invited_by,
      );
    }
    updateInvitationStatus(invitation.id, "accepted");

    const inviter = getUserById(invitation.invited_by);
    if (inviter) {
      createNotification(inviter.id, {
        title: "Invitation accepted",
        message: `${session.user.email ?? "A teammate"} joined ${trip.name}.`,
        type: "success",
        action_url: `/dashboard/trips/${trip.id}`,
      });
    }

    return NextResponse.json({ success: true, status: "accepted" });
  }

  updateInvitationStatus(invitation.id, "declined");
  const inviter = getUserById(invitation.invited_by);
  if (inviter) {
    createNotification(inviter.id, {
      title: "Invitation declined",
      message: `${session.user.email ?? "A teammate"} declined ${trip.name}.`,
      type: "warning",
      action_url: `/dashboard/trips/${trip.id}`,
    });
  }

  return NextResponse.json({ success: true, status: "declined" });
}
