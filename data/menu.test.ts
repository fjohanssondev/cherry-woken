import { describe, expect, it } from "vitest";

import { menu } from "@/data/menu";

const dishes = menu.flatMap((section) => section.dishes);

describe("menu dish ids", () => {
  it("gives every dish an id", () => {
    for (const dish of dishes) {
      expect(dish.id, dish.name).toMatch(/^d\d+$/);
    }
  });

  it("keeps every id unique", () => {
    const ids = dishes.map((dish) => dish.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("menu numbers", () => {
  it("keeps menu numbers unique among numbered dishes", () => {
    const numbers = dishes
      .map((dish) => dish.no)
      .filter((no): no is number => no != null);
    expect(new Set(numbers).size).toBe(numbers.length);
  });
});
