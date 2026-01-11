"use client";

import Link from "next/link";
import type { Route } from "next";
import { siteConfig } from "@/config/site";
import { useTranslations } from "@/components/providers/app-providers";

export function SiteFooter() {
  const t = useTranslations();
  const footerSections = [
    {
      title: t.footer.product,
      links: [
        { name: t.footer.links.features, href: "#features" },
        { name: t.footer.links.pricing, href: "#pricing" },
        { name: t.footer.links.releaseNotes, href: "#" },
      ],
    },
    {
      title: t.footer.resources,
      links: [
        { name: t.footer.links.documentation, href: "#" },
        { name: t.footer.links.support, href: "#" },
        { name: t.footer.links.blog, href: "#" },
      ],
    },
    {
      title: t.footer.company,
      links: [
        { name: t.footer.links.about, href: "#" },
        { name: t.footer.links.careers, href: "#" },
        { name: t.footer.links.contact, href: "#" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-stone-800 bg-stone-950 text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-12 grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-8">
          <div className="flex flex-col gap-6 xl:col-span-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined filled-icon text-4xl">
                wb_sunny
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">
                {siteConfig.name}
              </span>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-stone-400">
              {t.site.description}
            </p>
          </div>
          <div className="hidden xl:block xl:col-span-1" />
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-7 xl:grid-cols-3">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-3 text-sm text-stone-400">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href as Route}
                        className="transition-colors hover:text-primary"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-stone-800" />
        <div className="flex flex-col items-center justify-between gap-6 py-6 text-xs text-stone-500 md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}.{" "}
            {t.footer.legal.rights}
          </p>
          <div className="flex gap-4 text-stone-400">
            <Link href={"#" as Route} className="transition hover:text-white">
              {t.footer.legal.privacy}
            </Link>
            <Link href={"#" as Route} className="transition hover:text-white">
              {t.footer.legal.terms}
            </Link>
            <Link href={"#" as Route} className="transition hover:text-white">
              {t.footer.legal.status}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
