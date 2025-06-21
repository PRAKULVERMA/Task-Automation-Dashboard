import { describe, it, expect } from "vitest";
import { taskFormSchema, TaskFormData, defaultTaskValues } from "../taskSchema";

describe("Task Form Schema Validation", () => {
  const validTaskData: TaskFormData = {
    name: "Valid Task Name",
    description:
      "This is a valid task description that meets the minimum length requirement.",
    triggerType: "Daily",
    category: "HR",
    triggeredBy: "Test User",
    priority: "Medium",
    enableNotifications: true,
    retryAttempts: 3,
    timeoutMinutes: 30,
  };

  describe("Valid Data", () => {
    it("validates correct task data", () => {
      const result = taskFormSchema.safeParse(validTaskData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validTaskData);
      }
    });

    it("applies default values correctly", () => {
      const minimalData = {
        name: "Test Task",
        description: "This is a test task description.",
        triggerType: "Daily" as const,
        category: "HR" as const,
        triggeredBy: "User",
      };

      const result = taskFormSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.priority).toBe("Medium");
        expect(result.data.enableNotifications).toBe(true);
        expect(result.data.retryAttempts).toBe(3);
        expect(result.data.timeoutMinutes).toBe(30);
      }
    });
  });

  describe("Name Validation", () => {
    it("rejects names that are too short", () => {
      const invalidData = { ...validTaskData, name: "AB" };
      const result = taskFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Task name must be at least 3 characters",
        );
      }
    });

    it("rejects names that are too long", () => {
      const invalidData = {
        ...validTaskData,
        name: "A".repeat(101),
      };
      const result = taskFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Task name must not exceed 100 characters",
        );
      }
    });

    it("trims whitespace from names", () => {
      const dataWithWhitespace = {
        ...validTaskData,
        name: "  Valid Task Name  ",
      };
      const result = taskFormSchema.safeParse(dataWithWhitespace);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Valid Task Name");
      }
    });

    it("rejects empty names after trimming", () => {
      const invalidData = { ...validTaskData, name: "   " };
      const result = taskFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Task name must be at least 3 characters",
        );
      }
    });
  });

  describe("Description Validation", () => {
    it("rejects descriptions that are too short", () => {
      const invalidData = { ...validTaskData, description: "Too short" };
      const result = taskFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Description must be at least 10 characters",
        );
      }
    });

    it("rejects descriptions that are too long", () => {
      const invalidData = {
        ...validTaskData,
        description: "A".repeat(501),
      };
      const result = taskFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Description must not exceed 500 characters",
        );
      }
    });

    it("accepts valid description length", () => {
      const validData = {
        ...validTaskData,
        description: "This is a perfectly valid description for the task.",
      };
      const result = taskFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("Enum Validation", () => {
    it("rejects invalid trigger types", () => {
      const invalidData = { ...validTaskData, triggerType: "Invalid" as any };
      const result = taskFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("accepts valid trigger types", () => {
      const triggerTypes = ["Daily", "Weekly", "Manual"];
      triggerTypes.forEach((triggerType) => {
        const data = { ...validTaskData, triggerType: triggerType as any };
        const result = taskFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("rejects invalid categories", () => {
      const invalidData = {
        ...validTaskData,
        category: "InvalidCategory" as any,
      };
      const result = taskFormSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("accepts valid categories", () => {
      const categories = ["HR", "Finance", "Operations", "Marketing", "IT"];
      categories.forEach((category) => {
        const data = { ...validTaskData, category: category as any };
        const result = taskFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("accepts valid priority levels", () => {
      const priorities = ["Low", "Medium", "High"];
      priorities.forEach((priority) => {
        const data = { ...validTaskData, priority: priority as any };
        const result = taskFormSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("Number Validation", () => {
    it("validates retry attempts range", () => {
      // Valid range
      const validData = { ...validTaskData, retryAttempts: 2 };
      expect(taskFormSchema.safeParse(validData).success).toBe(true);

      // Too low
      const tooLow = { ...validTaskData, retryAttempts: -1 };
      expect(taskFormSchema.safeParse(tooLow).success).toBe(false);

      // Too high
      const tooHigh = { ...validTaskData, retryAttempts: 6 };
      expect(taskFormSchema.safeParse(tooHigh).success).toBe(false);
    });

    it("validates timeout minutes range", () => {
      // Valid range
      const validData = { ...validTaskData, timeoutMinutes: 60 };
      expect(taskFormSchema.safeParse(validData).success).toBe(true);

      // Too low
      const tooLow = { ...validTaskData, timeoutMinutes: 0 };
      expect(taskFormSchema.safeParse(tooLow).success).toBe(false);

      // Too high
      const tooHigh = { ...validTaskData, timeoutMinutes: 1441 };
      expect(taskFormSchema.safeParse(tooHigh).success).toBe(false);
    });
  });

  describe("Boolean Validation", () => {
    it("validates enableNotifications as boolean", () => {
      const validTrue = { ...validTaskData, enableNotifications: true };
      expect(taskFormSchema.safeParse(validTrue).success).toBe(true);

      const validFalse = { ...validTaskData, enableNotifications: false };
      expect(taskFormSchema.safeParse(validFalse).success).toBe(true);
    });
  });

  describe("TriggeredBy Validation", () => {
    it("validates triggeredBy length", () => {
      // Too short
      const tooShort = { ...validTaskData, triggeredBy: "A" };
      expect(taskFormSchema.safeParse(tooShort).success).toBe(false);

      // Too long
      const tooLong = { ...validTaskData, triggeredBy: "A".repeat(51) };
      expect(taskFormSchema.safeParse(tooLong).success).toBe(false);

      // Valid length
      const valid = { ...validTaskData, triggeredBy: "Valid User" };
      expect(taskFormSchema.safeParse(valid).success).toBe(true);
    });
  });

  describe("Default Values", () => {
    it("has correct default values", () => {
      expect(defaultTaskValues.triggerType).toBe("Manual");
      expect(defaultTaskValues.category).toBe("Operations");
      expect(defaultTaskValues.triggeredBy).toBe("User");
      expect(defaultTaskValues.status).toBe("Scheduled");
      expect(defaultTaskValues.priority).toBe("Medium");
      expect(defaultTaskValues.enableNotifications).toBe(true);
      expect(defaultTaskValues.retryAttempts).toBe(3);
      expect(defaultTaskValues.timeoutMinutes).toBe(30);
    });
  });
});
