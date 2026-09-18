import type { CategoryId, Dish, MenuSection } from "@/data/menu";

/** Does a dish belong to the given filter category? */
export function dishMatchesCategory(dish: Dish, category: CategoryId): boolean {
  if (category === "allt") return true;
  if (category === "starkt") return Boolean(dish.spicy);
  return dish.tags?.includes(category) ?? false;
}

/** Free-text search across name, description and menu number. */
export function dishMatchesQuery(dish: Dish, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    dish.name.toLowerCase().includes(q) ||
    (dish.description?.toLowerCase().includes(q) ?? false) ||
    String(dish.no ?? "").includes(q)
  );
}

export function countDishes(sections: MenuSection[]): number {
  return sections.reduce((total, section) => total + section.dishes.length, 0);
}

/** Returns only the sections (and dishes) that match the active filters. */
export function filterMenu(
  sections: MenuSection[],
  category: CategoryId,
  query: string
): MenuSection[] {
  return sections
    .map((section) => ({
      ...section,
      dishes: section.dishes.filter(
        (dish) =>
          dishMatchesCategory(dish, category) && dishMatchesQuery(dish, query)
      ),
    }))
    .filter((section) => section.dishes.length > 0);
}
