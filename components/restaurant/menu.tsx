import * as React from "react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Section                                                                     */
/* -------------------------------------------------------------------------- */

function Section({
  span = "half",
  className,
  children,
}: {
  span?: "half" | "full";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn("break-inside-avoid", span === "full" && "md:col-span-2", className)}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  chinese,
}: {
  title: string;
  chinese?: string;
}) {
  return (
    <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-2">
      <h2 className="font-serif text-2xl tracking-tight">{title}</h2>
      {chinese ? (
        <span className="text-sm text-muted-foreground">{chinese}</span>
      ) : null}
    </div>
  );
}

function SectionList({
  columns = false,
  children,
}: {
  /** When true the dishes flow in two balanced columns. */
  columns?: boolean;
  children: React.ReactNode;
}) {
  return (
    <ul
      className={cn(
        "space-y-4",
        columns && "sm:columns-2 sm:gap-x-12 sm:space-y-0 [&>li]:sm:mb-4"
      )}
    >
      {children}
    </ul>
  );
}

Section.Header = SectionHeader;
Section.List = SectionList;

/* -------------------------------------------------------------------------- */
/* Dish                                                                        */
/* -------------------------------------------------------------------------- */

function Dish({ children }: { children: React.ReactNode }) {
  return (
    <li className="grid break-inside-avoid grid-cols-[1.75rem_1fr_auto] items-start gap-x-2">
      {children}
    </li>
  );
}

function DishMarker({ children }: { children?: React.ReactNode }) {
  return (
    <span className="pt-0.5 text-sm tabular-nums text-muted-foreground">
      {children}
    </span>
  );
}

function DishContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function DishLine({ children }: { children: React.ReactNode }) {
  return <div className="flex items-baseline">{children}</div>;
}

function DishTitle({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 font-medium">
      {children}
    </span>
  );
}

/** The dotted leader that runs between a dish name and its price. */
function DishLeader() {
  return (
    <span
      aria-hidden="true"
      className="mx-2 mb-1 min-w-4 flex-1 self-end border-b border-dotted border-border"
    />
  );
}

function DishPrice({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 text-sm tabular-nums text-price">
      {children}&nbsp;kr
    </span>
  );
}

function DishNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-0.5 text-xs text-muted-foreground">{children}</p>;
}

/** Trailing slot (e.g. the add-to-list control), aligned with the dish name. */
function DishAction({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center self-start pt-px">{children}</div>;
}

Dish.Marker = DishMarker;
Dish.Content = DishContent;
Dish.Line = DishLine;
Dish.Title = DishTitle;
Dish.Leader = DishLeader;
Dish.Price = DishPrice;
Dish.Note = DishNote;
Dish.Action = DishAction;

export { Section, Dish };
