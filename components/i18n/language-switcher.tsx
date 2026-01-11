"use client";

import { useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { localeLabels, locales, type Locale } from "@/lib/i18n";
import { useLocale, useTranslations } from "@/components/providers/app-providers";

type LanguageSwitcherProps = {
  align?: "start" | "center" | "end";
  showLabel?: boolean;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "ghost";
};

export function LanguageSwitcher({
  align = "end",
  showLabel = true,
  className,
  size = "sm",
  variant = "outline",
}: LanguageSwitcherProps) {
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const t = useTranslations();

  const handleChange = (next: Locale) => {
    if (next === locale) {
      return;
    }
    setLocale(next);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size={size}
          className={cn("gap-2", className)}
          aria-label={t.common.languageLabel}
        >
          <Globe className="h-4 w-4" />
          {showLabel ? (
            <span className="text-xs font-medium">{localeLabels[locale]}</span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-44">
        {locales.map((option) => (
          <DropdownMenuItem
            key={option}
            onSelect={(event) => {
              event.preventDefault();
              handleChange(option);
            }}
            className="flex items-center justify-between"
          >
            <span>{localeLabels[option]}</span>
            {option === locale ? (
              <Check className="h-4 w-4 text-primary" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
