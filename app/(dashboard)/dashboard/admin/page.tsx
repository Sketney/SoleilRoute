import { ShieldCheck } from "lucide-react";
import { ModeratorsPanel } from "@/components/admin/moderators-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/roles";
import { getUserById } from "@/server/db";

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  const user = await getUserById(session.user.id);
  if (!isAdminEmail(user?.email ?? null)) {
    return (
      <Card className="border-border/70">
        <CardContent className="py-10 text-sm text-muted-foreground">
          Access denied.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Admin</h1>
          <p className="text-sm text-muted-foreground">
            Moderators, visa QA, and reminder operations.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/dashboard/admin/visa">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Visa QA
          </a>
        </Button>
      </div>
      <ModeratorsPanel />
    </div>
  );
}
