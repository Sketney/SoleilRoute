import { VisaChecker } from "@/components/dashboard/visa-checker";
import { getRequestLocale } from "@/lib/i18n/server";
import { getTranslations } from "@/lib/i18n";

export const metadata = {
  title: "Visa intelligence",
};

export default async function VisaPage() {
  const locale = await getRequestLocale();
  const t = getTranslations(locale);

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{t.visaChecker.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.visaChecker.description}
        </p>
      </div>
      <VisaChecker />
    </section>
  );
}
