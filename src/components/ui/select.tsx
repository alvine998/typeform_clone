"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  searchable?: boolean;
  disabled?: boolean;
  className?: string;
}

function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  helperText,
  searchable = false,
  disabled = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = useCallback(
    (opt: SelectOption) => {
      if (opt.disabled) return;
      onChange?.(opt.value);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchable) {
      searchRef.current?.focus();
    }
  }, [open, searchable]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {label && (
        <label
          className={cn(
            "mb-1.5 block text-sm font-medium",
            error ? "text-red-500" : "text-gray-700"
          )}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border bg-white px-4 py-2.5 text-left text-sm transition-all duration-200",
          "focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:ring-red-500/20"
            : open
            ? "border-purple-500 ring-2 ring-purple-500/20"
            : "border-gray-300 hover:border-gray-400",
          "bg-white",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          className={cn(
            "truncate",
            selected ? "text-gray-900" : "text-gray-400"
          )}
        >
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
            {searchable && (
              <div className="border-b border-gray-100 p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full rounded-lg border-0 bg-gray-50 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
            <ul className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-center text-sm text-gray-500">
                  No options found
                </li>
              ) : (
                filtered.map((opt) => (
                  <li key={opt.value}>
                    <button
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors",
                        opt.value === value
                          ? "bg-purple-50 text-purple-700"
                          : "text-gray-700 hover:bg-gray-50",
                        opt.disabled && "cursor-not-allowed opacity-50"
                      )}
                    >
                      <span className="truncate">{opt.label}</span>
                      {opt.value === value && (
                        <Check className="h-4 w-4 shrink-0 text-purple-600" />
                      )}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {(error || helperText) && (
        <p
          className={cn(
            "mt-1.5 text-xs",
            error ? "text-red-500" : "text-gray-500"
          )}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export { Select };
