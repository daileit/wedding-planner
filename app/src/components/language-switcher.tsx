"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { type Locale, locales, localeNames, localeFlags } from "@/lib/i18n/config";
import { setLocale } from "@/lib/i18n/server";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  variant?: "icon" | "full";
}

export function LanguageSwitcher({ currentLocale, variant = "icon" }: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(locale: Locale) {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={variant === "icon" ? "icon" : "sm"} disabled={isPending}>
          {variant === "icon" ? (
            <Globe className="h-5 w-5" />
          ) : (
            <>
              <span className="mr-1">{localeFlags[currentLocale]}</span>
              {localeNames[currentLocale]}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleChange(locale)}
            className={locale === currentLocale ? "bg-accent" : ""}
          >
            <span className="mr-2">{localeFlags[locale]}</span>
            {localeNames[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
