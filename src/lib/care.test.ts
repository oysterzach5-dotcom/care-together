import { describe, it, expect } from "vitest";
import { estimateTotal } from "./care";

describe("estimateTotal", () => {
  it("multiplies hourly rate by hours per day and days", () => {
    expect(estimateTotal(1500, 4, 3)).toBe(18000);
  });
});
