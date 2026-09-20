"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

export function InfoTooltip({
  label,
  text,
  className,
}: {
  label: string;
  text: string;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();

  return (
    <span className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
        }}
        className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none"
      >
        <Info className="size-3.5" />
      </button>
      {open ? (
        <span
          role="tooltip"
          id={id}
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 max-w-[70vw] -translate-x-1/2 rounded-md border border-border bg-popover px-3 py-2 text-xs leading-relaxed font-normal text-popover-foreground shadow-md"
        >
          {text}
        </span>
      ) : null}
    </span>
  );
}
