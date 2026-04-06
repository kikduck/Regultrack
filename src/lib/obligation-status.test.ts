import { statusFromDueDateAndAlerts, calendarDaysFromTo } from "./obligation-status";

describe("obligation-status logic", () => {
  const today = "2026-04-05";

  describe("calendarDaysFromTo", () => {
    it("should return 0 for same day", () => {
      expect(calendarDaysFromTo(today, today)).toBe(0);
    });

    it("should return 1 for next day", () => {
      expect(calendarDaysFromTo(today, "2026-04-06")).toBe(1);
    });

    it("should return -1 for previous day", () => {
      expect(calendarDaysFromTo(today, "2026-04-04")).toBe(-1);
    });

    it("should handle month boundaries", () => {
      expect(calendarDaysFromTo("2026-03-31", "2026-04-01")).toBe(1);
    });
  });

  describe("statusFromDueDateAndAlerts", () => {
    const alertDays = [90, 30, 7]; // Max lead is 90

    it("should be expired if due date is in the past", () => {
      expect(statusFromDueDateAndAlerts("2026-04-04", alertDays, today)).toBe("expired");
    });

    it("should be expiring_soon if due date is today", () => {
      expect(statusFromDueDateAndAlerts(today, alertDays, today)).toBe("expiring_soon");
    });

    it("should be expiring_soon if within lead window (e.g., J+45)", () => {
      expect(statusFromDueDateAndAlerts("2026-05-20", alertDays, today)).toBe("expiring_soon");
    });

    it("should be expiring_soon if exactly at lead window (J+90)", () => {
      // 2026-04-05 + 90 days = 2026-07-04
      expect(statusFromDueDateAndAlerts("2026-07-04", alertDays, today)).toBe("expiring_soon");
    });

    it("should be valid if beyond lead window (J+91)", () => {
      expect(statusFromDueDateAndAlerts("2026-07-05", alertDays, today)).toBe("valid");
    });

    it("should use default alert days if null provided", () => {
      // Default max is 90
      expect(statusFromDueDateAndAlerts("2026-07-04", null, today)).toBe("expiring_soon");
      expect(statusFromDueDateAndAlerts("2026-07-05", null, today)).toBe("valid");
    });
  });
});
