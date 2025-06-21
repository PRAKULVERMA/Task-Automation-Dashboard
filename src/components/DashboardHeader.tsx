import { NewAutomationModal } from "./NewAutomationModal";
import { TaskFormModal } from "./TaskFormModal";
import { ThemeToggle } from "./ThemeToggle";
import { RoleSelector } from "./RoleSelector";
import { NewAutomationFormData } from "@/types/task";
import { TaskFormData } from "@/schemas/taskSchema";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";
import { useRole } from "@/contexts/RoleContext";

interface DashboardHeaderProps {
  onAddTask: (formData: NewAutomationFormData) => void;
  onCreateTask?: (formData: TaskFormData) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export const DashboardHeader = ({
  onAddTask,
  onCreateTask,
  onRefresh,
  isLoading,
}: DashboardHeaderProps) => {
  const { permissions } = useRole();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Task Automation Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor and manage automated workflows for Habot Connect DMCC
        </p>
      </div>

      <div className="flex items-center gap-3">
        <RoleSelector />

        <ThemeToggle />

        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>

        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </Button>

        {permissions.canCreate &&
          (onCreateTask ? (
            <TaskFormModal mode="add" onSubmit={onCreateTask} />
          ) : (
            <NewAutomationModal onAddTask={onAddTask} />
          ))}
      </div>
    </div>
  );
};
