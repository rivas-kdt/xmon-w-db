"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { LanguageIcon } from "@heroicons/react/24/solid";
import { setUserLocale } from "@/services/locale"; // same helper as in LocaleSwitcherSelect
import { Locale } from "@/i18n/config";

export default function LocaleSwitcherDropdown() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const items = [
    { value: "en", label: t("en") },
    { value: "jp", label: t("jp") },
  ];

  function switchLocale(value: string) {
    const locale = value as Locale;
    startTransition(() => {
      setUserLocale(locale);
    });
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="p-2 border border-muted bg-muted rounded-full">
          <LanguageIcon className="h-[1.2rem] w-[1.2rem]" />
        </div>
        <span>{items.find((i) => i.value === locale)?.label}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button disabled={isPending} className="flex items-center">
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-32">
          {items.map((item) => (
            <DropdownMenuItem
              key={item.value}
              onSelect={() => switchLocale(item.value)}
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
