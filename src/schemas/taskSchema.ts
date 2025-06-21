import { z } from "zod";

export const taskFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Task name must be at least 3 characters")
    .max(100, "Task name must not exceed 100 characters"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters")
    .trim(),

  triggerType: z.enum(["Daily", "Weekly", "Manual"], {
    required_error: "Please select a trigger type",
  }),

  category: z.enum(["HR", "Finance", "Operations", "Marketing", "IT"], {
    required_error: "Please select a category",
  }),

  triggeredBy: z
    .string()
    .min(2, "Triggered by must be at least 2 characters")
    .max(50, "Triggered by must not exceed 50 characters")
    .trim(),

  status: z.enum(["Running", "Completed", "Failed", "Scheduled"]).optional(),

  // Optional fields for advanced configuration
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),

  enableNotifications: z.boolean().default(true),

  retryAttempts: z
    .number()
    .min(0, "Retry attempts must be 0 or greater")
    .max(5, "Maximum 5 retry attempts allowed")
    .default(3),

  timeoutMinutes: z
    .number()
    .min(1, "Timeout must be at least 1 minute")
    .max(1440, "Timeout cannot exceed 24 hours")
    .default(30),
});

export type TaskFormData = z.infer<typeof taskFormSchema>;

// Default values for new tasks
export const defaultTaskValues: Partial<TaskFormData> = {
  triggerType: "Manual",
  category: "Operations",
  triggeredBy: "User",
  status: "Scheduled",
  priority: "Medium",
  enableNotifications: true,
  retryAttempts: 3,
  timeoutMinutes: 30,
};
