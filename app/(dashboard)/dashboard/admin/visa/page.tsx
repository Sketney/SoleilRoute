import { notFound, redirect } from "next/navigation";
import { VisaQaPanel } from "@/components/admin/visa-qa-panel";
import { getServerSession } from "@/lib/auth/session";
import { listVisaChecks, listVisaIssueReports, listVisaManualOverrides } from "@/server/db";

export const metadata = {
  title: "Visa QA",
};

export default async function VisaQaPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  if (!session.user.is_admin && !session.user.is_moderator) {
    notFound();
  }

  const [checks, reports, overrides] = await Promise.all([
    listVisaChecks(50),
    listVisaIssueReports(50),
    listVisaManualOverrides(50),
  ]);

  return <VisaQaPanel initialData={{ checks, reports, overrides }} />;
}
