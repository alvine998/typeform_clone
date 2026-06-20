"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  separator?: boolean;
}

export interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

function Dropdown({ trigger, items, align = "left", className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number | string; right: number | string }>({ top: 0, left: 0, right: "auto" });
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !menuRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current.offsetHeight;
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const top =
      spaceBelow < menuHeight + 8
        ? triggerRect.top - menuHeight - 4
        : triggerRect.bottom + 4;

    let left: number | "auto" = "auto";
    let right: number | "auto" = "auto";

    if (align === "right") {
      right = viewportWidth - triggerRect.right;
    } else {
      left = triggerRect.left;
      if (left + 200 > viewportWidth) {
        left = "auto";
        right = viewportWidth - triggerRect.right;
      }
    }

    setPosition({ top, left, right });
  }, [align]);

  useEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      <div ref={triggerRef} onClick={() => setOpen(!open)}>
        {trigger}
      </div>

      {open && (
        <div
          ref={menuRef}
          className="fixed z-50 animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            top: position.top,
            left: position.left !== "auto" ? position.left : undefined,
            right: position.right !== "auto" ? position.right : undefined,
          }}
        >
          <div className="min-w-[180px] overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl">
            {items.map((item, i) =>
              item.separator ? (
                <div
                  key={`sep-${i}`}
                  className="my-1 border-t border-gray-100"
                />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    item.onClick?.();
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors",
                    item.danger
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700 hover:bg-gray-50",
                    item.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  {item.icon && (
                    <span className="shrink-0">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { Dropdown };
