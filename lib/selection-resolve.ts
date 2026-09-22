import { menu, type Dish } from "@/data/menu";
import type { SelectionItems } from "@/lib/selection-store";

const DISH_BY_ID = new Map<string, Dish>();
for (const section of menu) {
  for (const dish of section.dishes) DISH_BY_ID.set(dish.id, dish);
}

export type ResolvedEntry = { dish: Dish; quantity: number };

export function resolveSelection(items: SelectionItems) {
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
