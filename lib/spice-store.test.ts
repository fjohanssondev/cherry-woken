// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("spice-store vote migration", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("migrates number-keyed votes to stable ids", async () => {
    localStorage.setItem(
      "cherry-woken:spice-votes",
      JSON.stringify({ "1": 2, "12": 3, "999": 1 })
    );
    const store = await import("@/lib/spice-store");
    expect(store.getSnapshot().myVotes).toEqual({ d01: 2, d16: 3 });
  });

  it("keeps id-keyed votes untouched", async () => {
    localStorage.setItem(
      "cherry-woken:spice-votes",
      JSON.stringify({ d01: 2 })
    );
    const store = await import("@/lib/spice-store");
    expect(store.getSnapshot().myVotes).toEqual({ d01: 2 });
  });
});
