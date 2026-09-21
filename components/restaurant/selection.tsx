"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Minus, Plus, Trash2 } from "lucide-react";

import { menu, type Dish } from "@/data/menu";
import {
  addOne,
  clearSelection,
  getServerSnapshot,
  getSnapshot,
  removeOne,
  subscribe,
} from "@/lib/selection-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function dishKey(dish: Dish) {
  return dish.id;
}

const DISH_BY_KEY = new Map<string, Dish>();
for (const section of menu) {
  for (const dish of section.dishes) {
    DISH_BY_KEY.set(dishKey(dish), dish);
  }
}

/** Subscribes to just one dish's quantity, so a row only re-renders for itself. */
function useDishQuantity(key: string) {
  return React.useSyncExternalStore(
    subscribe,
    () => getSnapshot()[key] ?? 0,
    () => 0
  );
}

type SelectionEntry = { key: string; quantity: number; dish: Dish };

/** The whole pick list, resolved back to dishes with a count and total. */
function useSelection() {
  const items = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  return React.useMemo(() => {
    const entries: SelectionEntry[] = Object.entries(items)
      .map(([key, quantity]) => ({ key, quantity, dish: DISH_BY_KEY.get(key) }))
      .filter(
        (entry): entry is SelectionEntry =>
          Boolean(entry.dish) && entry.quantity > 0
      );
    const count = entries.reduce((sum, entry) => sum + entry.quantity, 0);
    const total = entries.reduce(
      (sum, entry) => sum + entry.dish.price * entry.quantity,
      0
    );
    return { entries, count, total };
  }, [items]);
}

/* -------------------------------------------------------------------------- */
/* Per-dish control                                                            */
/* -------------------------------------------------------------------------- */

export function DishSelector({ dish }: { dish: Dish }) {
  const key = dishKey(dish);
  const quantity = useDishQuantity(key);

  if (quantity === 0) {
    return (
      <button
        type="button"
        onClick={() => addOne(key)}
        aria-label={`Lägg till ${dish.name}`}
        className="flex size-7 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-gold hover:text-gold"
      >
        <Plus className="size-4" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-gold/60 bg-gold/10 px-0.5">
      <button
        type="button"
        onClick={() => removeOne(key)}
        aria-label={`Ta bort en ${dish.name}`}
        className="flex size-6 items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/20"
      >
        <Minus className="size-3.5" />
      </button>
      <span className="min-w-4 text-center text-xs font-semibold tabular-nums text-foreground">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => addOne(key)}
        aria-label={`Lägg till en ${dish.name}`}
        className="flex size-6 items-center justify-center rounded-full text-gold transition-colors hover:bg-gold/20"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Sticky summary                                                              */
/* -------------------------------------------------------------------------- */

export function OrderSummary() {
  const { entries, count, total } = useSelection();
  const [open, setOpen] = React.useState(false);

  if (count === 0) return null;

  return (
    <>
      {/* Reserve space so the fixed bar never hides the footer. */}
      <div aria-hidden className="h-24" />
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 shadow-lg backdrop-blur">
        <div className="mx-auto max-w-5xl px-6">
          {open ? (
            <div className="max-h-[45vh] overflow-y-auto border-b border-border py-4">
              <ul className="space-y-2">
                {entries.map(({ key, quantity, dish }) => (
                  <li key={key} className="flex items-center gap-3 text-sm">
                    <DishSelector dish={dish} />
                    <span className="flex-1">
                      {dish.no != null ? (
                        <span className="mr-2 text-muted-foreground tabular-nums">
                          {dish.no}
                        </span>
                      ) : null}
                      {dish.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-price">
                      {dish.price * quantity}&nbsp;kr
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 py-3">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              className="flex items-center gap-2 text-sm"
            >
              {open ? (
                <ChevronDown className="size-4" />
              ) : (
                <ChevronUp className="size-4" />
              )}
              <span className="font-medium">
                {count} {count === 1 ? "rätt" : "rätter"}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="font-semibold tabular-nums text-price">
                {total}&nbsp;kr
              </span>
            </button>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              <Trash2 className="size-4" />
              Rensa
            </Button>
          </div>

          <p className={cn("pb-3 text-xs text-muted-foreground", open && "hidden")}>
            Din egen lista — sparas i den här webbläsaren och skickar ingen
            beställning.
          </p>
        </div>
      </div>
    </>
  );
}
