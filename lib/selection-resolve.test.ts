import { describe, expect, it } from "vitest";

import { resolveSelection } from "@/lib/selection-resolve";

describe("resolveSelection", () => {
  it("computes count and total and drops unknown ids", () => {
    const { entries, count, total } = resolveSelection({ d03: 2, zzz: 1 });
    expect(entries).toHaveLength(1);
    expect(count).toBe(2);
    expect(total).toBe(120);
  });

  it("returns an empty result for an empty selection", () => {
    expect(resolveSelection({})).toEqual({ entries: [], count: 0, total: 0 });
  });
});
