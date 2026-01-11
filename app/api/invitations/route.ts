import { NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import {
  getTripById,
  getUserById,
  listInvitationsByUser,
} from "@/server/db";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invites = listInvitationsByUser(session.user.id, "pending");

  return NextResponse.json({
    invitations: invites.map((invite) => {
      const trip = getTripById(invite.trip_id);
      const inviter = getUserById(invite.invited_by);
      return {
        id: invite.id,
        tripId: invite.trip_id,
        tripName: trip?.name ?? "Trip",
        destination: trip
          ? `${trip.destination_city}, ${trip.destination_country}`
          : "Unknown destination",
        role: invite.role,
        invitedBy: inviter?.email ?? null,
        createdAt: invite.created_at,
      };
    }),
  });
}
