"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
  registerTab: (value: string, el: HTMLButtonElement | null) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children,
  ...props
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const activeTab = value ?? internalValue;

  const setActiveTab = useCallback(
    (v: string) => {
      if (!value) setInternalValue(v);
      onValueChange?.(v);
    },
    [value, onValueChange]
  );

  const registerTab = useCallback(
    (v: string, el: HTMLButtonElement | null) => {
      if (el) tabRefs.current.set(v, el);
      else tabRefs.current.delete(v);
    },
    []
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, registerTab }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "relative flex gap-1 overflow-x-auto border-b border-gray-200",
        "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function TabsTrigger({
  value,
  className,
  children,
  ...props
}: TabsTriggerProps) {
  const { activeTab, setActiveTab, registerTab } = useTabsContext();
  const isActive = activeTab === value;

  const ref = useCallback(
    (el: HTMLButtonElement | null) => {
      registerTab(value, el);
    },
    [value, registerTab]
  );

  return (
    <button
      ref={ref}
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors",
        isActive
          ? "text-purple-600"
          : "text-gray-500 hover:text-gray-700",
        className
      )}
      {...props}
    >
      {children}
      {isActive && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-purple-600" />
      )}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabsContent({
  value,
  className,
  children,
  ...props
}: TabsContentProps) {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn(
        "animate-in fade-in-0 slide-in-from-bottom-1 duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
