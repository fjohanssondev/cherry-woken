"use client";

import * as React from "react";
import { Check, Share2 } from "lucide-react";

import { menu, type Dish } from "@/data/menu";
import {
  getSnapshot,
  mergeSelection,
  parseSelection,
  replaceSelection,
  serializeSelection,
  type SelectionItems,
} from "@/lib/selection-store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DISH_BY_ID = new Map<string, Dish>();
for (const section of menu) {
  for (const dish of section.dishes) DISH_BY_ID.set(dish.id, dish);
}

type ResolvedEntry = { dish: Dish; quantity: number };

function resolve(items: SelectionItems) {
  const entries: ResolvedEntry[] = Object.entries(items)
    .map(([id, quantity]) => ({ dish: DISH_BY_ID.get(id), quantity }))
    .filter(
      (entry): entry is ResolvedEntry =>
        Boolean(entry.dish) && entry.quantity > 0
    );
  const count = entries.reduce((sum, entry) => sum + entry.quantity, 0);
  const total = entries.reduce(
    (sum, entry) => sum + entry.dish.price * entry.quantity,
    0
  );
  return { entries, count, total };
}

export function ShareListButton() {
  const [copied, setCopied] = React.useState(false);

  async function share() {
    const encoded = serializeSelection(getSnapshot());
    if (!encoded) return;
    const url = `${window.location.origin}/?lista=${encoded}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Min lista – Cherry Woken", url });
      } catch {
        return;
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      return;
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={share}>
      {copied ? <Check className="size-4" /> : <Share2 className="size-4" />}
      {copied ? "Kopierad" : "Dela"}
    </Button>
  );
}

export function SharedListPrompt() {
  const [incoming, setIncoming] = React.useState<SelectionItems | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("lista");
    if (!raw) return;

    const parsed = parseSelection(raw);
    if (Object.keys(parsed).length > 0) {
      queueMicrotask(() => setIncoming(parsed));
    }

    const url = new URL(window.location.href);
    url.searchParams.delete("lista");
    window.history.replaceState(null, "", url.toString());
  }, []);

  if (!incoming) return null;

  const { entries, count, total } = resolve(incoming);
  const hasCurrent = resolve(getSnapshot()).count > 0;

  function close() {
    setIncoming(null);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delad lista</DialogTitle>
          <DialogDescription>
            {count} {count === 1 ? "rätt" : "rätter"} · {total}&nbsp;kr
          </DialogDescription>
        </DialogHeader>

        <ul className="max-h-[40vh] space-y-1 overflow-y-auto text-sm">
          {entries.map(({ dish, quantity }) => (
            <li key={dish.id} className="flex items-center justify-between gap-3">
              <span>
                <span className="mr-1 text-muted-foreground tabular-nums">
                  {quantity}×
                </span>
                {dish.name}
              </span>
              <span className="shrink-0 tabular-nums text-price">
                {dish.price * quantity}&nbsp;kr
              </span>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button variant="ghost" onClick={close}>
            Avfärda
          </Button>
          {hasCurrent ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  mergeSelection(incoming);
                  close();
                }}
              >
                Lägg till
              </Button>
              <Button
                onClick={() => {
                  replaceSelection(incoming);
                  close();
                }}
              >
                Ersätt min lista
              </Button>
            </>
          ) : (
            <Button
              onClick={() => {
                mergeSelection(incoming);
                close();
              }}
            >
              Lägg till i listan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
