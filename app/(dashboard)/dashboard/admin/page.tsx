import { ModeratorsPanel } from "@/components/admin/moderators-panel";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/roles";
import { getUserById } from "@/server/db";

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  const user = getUserById(session.user.id);
  if (!isAdminEmail(user?.email ?? null)) {
    return (
      <Card className="border-border/70">
        <CardContent className="py-10 text-sm text-muted-foreground">
          Access denied.
        </CardContent>
      </Card>
    );
  }

  return <ModeratorsPanel />;
}
