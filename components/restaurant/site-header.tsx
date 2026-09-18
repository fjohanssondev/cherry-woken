import * as React from "react";

import { cn } from "@/lib/utils";
import { Lantern } from "@/components/restaurant/icons";

function SiteHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
      {children}
    </div>
  );
}

function Brand({
  kicker,
  name,
  tagline,
}: {
  kicker: string;
  name: string;
  tagline: string;
}) {
  return (
    <div className="max-w-md">
      <p className="flex items-center gap-3 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
        <span aria-hidden className="h-px w-8 bg-primary" />
        {kicker}
      </p>
      <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight sm:text-6xl">
        {name}
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {tagline}
      </p>
    </div>
  );
}

function HeaderLantern() {
  return (
    <Lantern className="hidden h-40 w-auto shrink-0 md:block" />
  );
}

type InfoLine = string | { text: string; href: string };

function Info({
  groups,
}: {
  groups: { label: string; lines: InfoLine[] }[];
}) {
  return (
    <div className="w-full max-w-xs rounded-lg border border-border bg-card p-5">
      {groups.map((group, index) => (
        <div
          key={group.label}
          className={cn(index > 0 && "mt-4 border-t border-border pt-4")}
        >
          <p className="text-[0.7rem] font-medium tracking-[0.15em] text-muted-foreground uppercase">
            {group.label}
          </p>
          <div className="mt-2 space-y-1">
            {group.lines.map((line) =>
              typeof line === "string" ? (
                <p key={line} className="text-sm">
                  {line}
                </p>
              ) : (
                <a
                  key={line.text}
                  href={line.href}
                  className="block text-sm text-primary hover:underline"
                >
                  {line.text}
                </a>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

SiteHeader.Brand = Brand;
SiteHeader.Lantern = HeaderLantern;
SiteHeader.Info = Info;

export { SiteHeader };
