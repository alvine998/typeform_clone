"use client";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Locale } from "@/types";

export interface LanguageSwitcherProps {
  className?: string;
}

const languages: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "id", label: "ID", flag: "\u{1F1EE}\u{1F1E9}" },
];

function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-lg bg-gray-100 p-1",
        className
      )}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setLocale(lang.code)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200",
            locale === lang.code
              ? "bg-white text-purple-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          <span className="text-sm">{lang.flag}</span>
          <span>{lang.label}</span>
        </button>
      ))}
    </div>
  );
}

export { LanguageSwitcher };
