import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";
import {
  getUserById,
  getTripById,
  listInvitationsByUser,
  listNotificationsByUser,
} from "@/server/db";
import { NotificationsHistory } from "@/components/notifications/notifications-history";
import { NotificationPreferencesForm } from "@/components/forms/account/notification-preferences-form";
import { PendingInvitations } from "@/components/notifications/pending-invitations";
import { getTranslations } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata = {
  title: "Notifications",
};

export default async function NotificationsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  const user = await getUserById(session.user.id);
  if (!user) {
    redirect("/login");
  }

  const notifications = await listNotificationsByUser(user.id, 200);
  const invitations = await Promise.all(
    (await listInvitationsByUser(user.id, "pending")).map(async (invite) => {
      const trip = await getTripById(invite.trip_id);
      const inviter = await getUserById(invite.invited_by);
      return {
        id: invite.id,
        tripId: invite.trip_id,
        tripName: trip?.name ?? t.notifications.tripFallback,
        destination: trip
          ? `${trip.destination_city}, ${trip.destination_country}`
          : t.notifications.unknownDestination,
        role: invite.role,
        invitedBy: inviter?.email ?? null,
        createdAt: invite.created_at,
      };
    }),
  );

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{t.notifications.historyTitle}</h1>
        <p className="text-sm text-muted-foreground">
          {t.notifications.historySubtitle}
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,_2fr)_minmax(0,_1fr)]">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-base font-semibold">
              {t.notifications.pendingInvitationsTitle}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t.notifications.pendingInvitationsSubtitle}
            </p>
          </div>
          <PendingInvitations initialInvitations={invitations} />
          <NotificationsHistory initialNotifications={notifications} />
        </div>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>{t.notifications.preferencesTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <NotificationPreferencesForm
              emailEnabled={user.notifications_email_enabled ?? true}
              inAppEnabled={user.notifications_in_app_enabled ?? true}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
