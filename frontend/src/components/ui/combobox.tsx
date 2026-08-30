import * as React from "react";

import { cn } from "@/lib/utils";

type ComboboxProps<T> = {
  children: React.ReactNode;
  items?: T[];
  itemToStringValue?: (item: T) => string;
  value?: T | null;
  onValueChange?: (value: T) => void;
  open?: boolean;
  className?: string;
};

export function Combobox<T>({ children, className }: ComboboxProps<T>) {
  return <div className={cn("relative", className)}>{children}</div>;
}

export function ComboboxInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="search"
      data-slot="combobox-input"
      className={cn(
        "h-12 w-full rounded-full border border-transparent bg-input/50 pl-5 pr-3 text-base text-foreground outline-none transition-[color,box-shadow,background-color] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function ComboboxContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="combobox-content"
      className={cn(
        "z-50 overflow-hidden rounded-2xl border bg-popover text-popover-foreground shadow-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ComboboxEmpty({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="combobox-empty" className={cn("px-4 py-3 text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export function ComboboxList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div data-slot="combobox-list" className={cn("max-h-72 overflow-y-auto", className)} {...props}>
      {children}
    </div>
  );
}

type ComboboxItemProps<T> = {
  value: T;
  children: React.ReactNode;
  onSelect?: (value: T) => void;
  className?: string;
};

export function ComboboxItem<T>({ value, children, onSelect, className }: ComboboxItemProps<T>) {
  return (
    <button
      type="button"
      className={cn("w-full border-b border-border/70 bg-transparent px-2 py-2 text-left last:border-b-0 hover:bg-muted/80", className)}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onSelect?.(value)}
    >
      {children}
    </button>
  );
}
