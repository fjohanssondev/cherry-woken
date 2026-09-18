"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const base =
  "inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground";

/**
 * The active option is driven purely by the `light`/`dark` class that
 * next-themes puts on <html>, so there is no client-only state to reconcile and
 * therefore no hydration mismatch.
 */
export function ThemeToggle() {
  const { setTheme } = useTheme();
  return (
    <div
      role="group"
      aria-label="Färgtema"
      className="inline-flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5"
    >
      <button
        type="button"
        onClick={() => setTheme("dark")}
        className={cn(
          base,
          "dark:bg-primary dark:text-primary-foreground dark:hover:text-primary-foreground"
        )}
      >
        <Moon className="size-3.5" />
        Mörkt
      </button>
      <button
        type="button"
        onClick={() => setTheme("light")}
        className={cn(
          base,
          "light:bg-primary light:text-primary-foreground light:hover:text-primary-foreground"
        )}
      >
        <Sun className="size-3.5" />
        Ljust
      </button>
    </div>
  );
}
