import Link from "next/link";
import { Mail, MessageCircle, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SupportDialog } from "@/components/support/support-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getServerSession } from "@/lib/auth/session";
import { getTranslations } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/i18n/server";

export const metadata = {
  title: "Help",
};

export default async function HelpPage() {
  const session = await getServerSession();
  const defaultEmail = session?.user.email ?? "";
  const locale = await getRequestLocale();
  const t = getTranslations(locale);
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">{t.help.title}</h1>
        <p className="text-sm text-muted-foreground">
          {t.help.subtitle}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4 text-primary" />
              {t.help.quickHelpTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              {t.help.quickHelpBody}
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/settings">{t.help.accountSettingsCta}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-primary" />
              {t.help.contactSupportTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              {t.help.contactSupportBody}
            </p>
            <SupportDialog defaultEmail={defaultEmail} />
          </CardContent>
        </Card>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {t.help.systemStatusTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>{t.help.systemStatusBody}</p>
            <Button asChild variant="outline" size="sm">
              <a href="#" aria-disabled="true">
                {t.help.statusButton}
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4 text-primary" />
            {t.help.faqTitle}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {t.help.faqs.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
