import { describe, expect, it } from "vitest";

import { dishName, dishNumber, isVotableDish } from "@/lib/spice";

describe("spice dish identity", () => {
  it("accepts numbered dishes and resolves their number and name", () => {
    expect(isVotableDish("d01")).toBe(true);
    expect(dishNumber("d01")).toBe(1);
    expect(dishName("d01")).toBe("Vietnamesiska vårrullar (2 st)");
  });

  it("rejects extras, unknown ids and non-strings", () => {
    expect(isVotableDish("d60")).toBe(false);
    expect(isVotableDish("nope")).toBe(false);
    expect(isVotableDish(12)).toBe(false);
  });
});
