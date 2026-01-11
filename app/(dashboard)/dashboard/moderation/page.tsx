import { ModerationQueue } from "@/components/community/moderation-queue";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";
import { isModerator } from "@/lib/auth/roles";
import { getUserById } from "@/server/db";

export default async function ModerationPage() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  const user = getUserById(session.user.id);
  if (!isModerator(user)) {
    return (
      <Card className="border-border/70">
        <CardContent className="py-10 text-sm text-muted-foreground">
          Access denied.
        </CardContent>
      </Card>
    );
  }

  return <ModerationQueue />;
}
