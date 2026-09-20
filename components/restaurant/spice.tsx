"use client";

import * as React from "react";

import type { Dish } from "@/data/menu";
import {
  getServerSnapshot,
  getSnapshot,
  removeVote,
  subscribe,
  vote,
  type SpiceAggregates,
} from "@/lib/spice-store";
import { cn } from "@/lib/utils";
import { Chili } from "@/components/restaurant/icons";

const LEVELS = [1, 2, 3] as const;

const LEVEL_LABELS: Record<number, string> = {
  1: "Mild",
  2: "Medel",
  3: "Stark",
};

function useSpiceState() {
  return React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
}

export function useSpiceAggregates(): SpiceAggregates {
  return useSpiceState().aggregates;
}

export function SpiceNotice() {
  const { error } = useSpiceState();
  if (!error) return null;
  return (
    <span className="text-sm text-muted-foreground">
      Röster kan inte hämtas just nu
    </span>
  );
}

export function resolveSpiceLevel(
  dish: Dish,
  aggregates: SpiceAggregates
): number {
  if (dish.no == null) return 0;
  const agg = aggregates[dish.no];
  if (agg && agg.count > 0) return Math.round(agg.avg);
  return 0;
}

function SpiceMeter({
  level,
  className,
}: {
  level: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {LEVELS.map((step) => (
        <Chili
          key={step}
          className={cn("size-3.5", step <= level ? "opacity-100" : "opacity-20")}
        />
      ))}
    </span>
  );
}

export function SpiceRating({ dish }: { dish: Dish }) {
  const { aggregates, myVotes } = useSpiceState();
  const [open, setOpen] = React.useState(false);

  if (dish.no == null) return null;

  const no = dish.no;
  const agg = aggregates[no];
  const count = agg?.count ?? 0;
  const rounded = count > 0 ? Math.round(agg.avg) : 0;
  const mine = myVotes[no];

  const countLabel =
    count === 0 ? "Rösta på styrkan" : count === 1 ? "1 röst" : `${count} röster`;

  return (
    <div className="mt-1.5">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={`Rösta på hur starkt ${dish.name} är`}
        className="inline-flex items-center gap-1.5 rounded-full text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <SpiceMeter level={rounded} />
        <span className="tabular-nums">{countLabel}</span>
      </button>

      {open ? (
        <div
          role="group"
          aria-label={`Sätt betyg på ${dish.name}`}
          className="mt-2 flex flex-wrap items-center gap-1.5"
        >
          {LEVELS.map((level) => {
            const active = mine === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => {
                  void (active ? removeVote(no) : vote(no, level));
                  setOpen(false);
                }}
                aria-pressed={active}
                aria-label={
                  active
                    ? `Ta bort din röst: ${LEVEL_LABELS[level]}`
                    : `${LEVEL_LABELS[level]} — ${level} av 3`
                }
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-colors",
                  active
                    ? "border-gold bg-gold/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-gold hover:text-foreground"
                )}
              >
                <SpiceMeter level={level} />
                <span>{LEVEL_LABELS[level]}</span>
              </button>
            );
          })}
          {mine != null ? (
            <span className="w-full text-xs text-muted-foreground sm:w-auto">
              Klicka på din nivå igen för att ta bort rösten
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function SpiceLegend() {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {LEVELS.map((step) => (
        <Chili key={step} className="size-3.5" />
      ))}
    </span>
  );
}
