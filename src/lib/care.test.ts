import { describe, it, expect } from "vitest";
import { estimateTotal } from "./care";

describe("estimateTotal", () => {
  it("multiplies hourly rate by hours per day and days", () => {
    expect(estimateTotal(1500, 4, 3)).toBe(18000);
  });
});

import { medboxTotal as _mt } from "./care";
import { test as _t, expect as _e } from "vitest";
_t("medicine box total = price x qty + delivery", () => {
  _e(_mt(1)).toBe(25500);
  _e(_mt(2)).toBe(50500);
});
