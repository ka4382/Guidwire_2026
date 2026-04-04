import { describe, expect, it } from "vitest";

import { estimateIncomeLoss } from "../src/services/claim.service.js";

describe("estimateIncomeLoss", () => {
  it("estimates loss proportionally to earnings and window size", () => {
    const result = estimateIncomeLoss(
      {
        avgWeeklyEarnings: 4200,
        avgDailyHours: 8
      },
      3
    );

    expect(result).toBeGreaterThan(200);
    expect(result).toBeLessThan(260);
  });
});

