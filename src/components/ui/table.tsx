"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  useState,
  useCallback,
} from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

export interface SortState {
  column: string;
  direction: SortDirection;
}

export type TableProps = HTMLAttributes<HTMLTableElement>;

const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("border-b border-gray-200", className)}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-100", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

const TableRow = forwardRef<
  HTMLTableRowElement,
  HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "transition-colors hover:bg-gray-50/50",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

export interface TableHeadProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortKey?: string;
  sortDirection?: SortDirection;
  onSort?: (key: string) => void;
}

const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  (
    {
      className,
      children,
      sortable,
      sortKey,
      sortDirection,
      onSort,
      ...props
    },
    ref
  ) => {
    const content = sortable && sortKey ? (
      <button
        type="button"
        onClick={() => onSort?.(sortKey)}
        className="inline-flex items-center gap-1 transition-colors hover:text-gray-900"
      >
        {children}
        {sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : sortDirection === "desc" ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronsUpDown className="h-4 w-4 opacity-40" />
        )}
      </button>
    ) : (
      children
    );

    return (
      <th
        ref={ref}
        className={cn(
          "h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-wider text-gray-500",
          sortable && "cursor-pointer select-none",
          className
        )}
        {...props}
      >
        {content}
      </th>
    );
  }
);
TableHead.displayName = "TableHead";

export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  mobileLabel?: string;
}

const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, mobileLabel, children, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "px-4 py-3 align-middle text-sm text-gray-900",
        className
      )}
      {...props}
    >
      {mobileLabel && (
        <span className="mb-1 block text-xs font-medium text-gray-500 sm:hidden">
          {mobileLabel}
        </span>
      )}
      {children}
    </td>
  )
);
TableCell.displayName = "TableCell";

function useSortable(initialColumn?: string, initialDirection?: SortDirection) {
  const [sort, setSort] = useState<SortState>({
    column: initialColumn || "",
    direction: initialDirection || null,
  });

  const handleSort = useCallback((column: string) => {
    setSort((prev) => ({
      column,
      direction:
        prev.column === column
          ? prev.direction === "asc"
            ? "desc"
            : prev.direction === "desc"
            ? null
            : "asc"
          : "asc",
    }));
  }, []);

  return { sort, handleSort };
}

export {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  useSortable,
};
