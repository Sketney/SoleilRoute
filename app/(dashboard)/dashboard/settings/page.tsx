import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/session";
import { getUserById, listSessionsByUser } from "@/server/db";
import { ProfileForm } from "@/components/forms/account/profile-form";
import { PasswordForm } from "@/components/forms/account/password-form";
import { SessionsForm } from "@/components/forms/account/sessions-form";
import { getTranslations } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
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

  const activeSessions = (await listSessionsByUser(user.id)).length;

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{t.settings.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.settings.subtitle}
        </p>
      </div>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.settings.profileTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileForm
            email={user.email}
            displayName={user.display_name ?? ""}
            avatarUrl={user.avatar_url ?? ""}
          />
        </CardContent>
      </Card>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.settings.passwordTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
      <Card className="border-border/70">
        <CardHeader>
          <CardTitle>{t.settings.sessionsTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <SessionsForm count={activeSessions} />
        </CardContent>
      </Card>
    </section>
  );
}
