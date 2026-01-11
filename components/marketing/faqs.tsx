"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslations } from "@/components/providers/app-providers";

export function FAQSection() {
  const t = useTranslations();

  return (
    <section id="faqs" className="py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl space-y-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t.faqs.heading}
          </h2>
          <p className="text-base text-stone-600 dark:text-stone-400">
            {t.faqs.subheading}
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full max-w-3xl rounded-xl border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900"
        >
        {t.faqs.items.map((faq) => (
          <AccordionItem key={faq.question} value={faq.question}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
        </Accordion>
      </div>
    </section>
  );
}



