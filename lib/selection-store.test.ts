import { beforeEach, describe, expect, it, vi } from "vitest";

import { parseSelection, serializeSelection } from "@/lib/selection-store";

describe("serializeSelection", () => {
  it("omits quantity 1 and encodes higher counts", () => {
    expect(serializeSelection({ d03: 1, d16: 2 })).toBe("d03,d16x2");
  });

  it("drops unknown ids and non-positive quantities", () => {
    expect(serializeSelection({ d03: 1, zzz: 5, d16: 0 })).toBe("d03");
  });
});

describe("parseSelection", () => {
  it("parses ids and quantities", () => {
    expect(parseSelection("d03,d16x2")).toEqual({ d03: 1, d16: 2 });
  });

  it("ignores unknown ids, empty tokens and junk", () => {
    expect(parseSelection("d03,zzz,,d999,junk")).toEqual({ d03: 1 });
  });

  it("caps quantity at 99", () => {
    expect(parseSelection("d03x9999")).toEqual({ d03: 99 });
  });

  it("round-trips a selection", () => {
    const items = { d03: 1, d16: 2, d55: 3 };
    expect(parseSelection(serializeSelection(items))).toEqual(items);
  });
});

describe("localStorage migration", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("converts legacy number and name keys to stable ids", async () => {
    localStorage.setItem(
      "cherry-woken:selection",
      JSON.stringify({ n1: 2, n12: 1, "x:Extra ris": 3, bogus: 1 })
    );
    const store = await import("@/lib/selection-store");
    expect(store.getSnapshot()).toEqual({ d01: 2, d16: 1, d60: 3 });
  });

  it("keeps already-migrated ids untouched", async () => {
    localStorage.setItem("cherry-woken:selection", JSON.stringify({ d01: 2 }));
    const store = await import("@/lib/selection-store");
    expect(store.getSnapshot()).toEqual({ d01: 2 });
  });
});
