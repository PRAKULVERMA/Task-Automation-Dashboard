export type TaskStatus = "Running" | "Completed" | "Failed" | "Scheduled";

export type TriggerType = "Daily" | "Weekly" | "Manual";

export interface AutomatedTask {
  id: string;
  name: string;
  status: TaskStatus;
  lastRunTime: Date | null;
  triggeredBy: string;
  description: string;
  triggerType: TriggerType;
  nextRunTime?: Date | null;
  executionTime?: number; // in milliseconds
  category: "HR" | "Finance" | "Operations" | "Marketing" | "IT";
}

export interface NewAutomationFormData {
  ruleName: string;
  triggerType: TriggerType;
  description: string;
  category: AutomatedTask["category"];
}

export interface TaskStats {
  total: number;
  running: number;
  completed: number;
  failed: number;
  scheduled: number;
}
