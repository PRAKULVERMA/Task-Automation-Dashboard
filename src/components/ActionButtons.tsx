import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Play,
  FileText,
  Settings,
  Loader2,
  Trash2,
  Zap,
  Eye,
  Wrench,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { AutomatedTask } from "@/types/task";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";
import { motion } from "framer-motion";
import { TaskDetailModal } from "./TaskDetailModal";
import { TaskCompleteIcon } from "./icons/TaskCompleteIcon";

interface ActionButtonsProps {
  task: AutomatedTask;
  onRunTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => void;
}

export const ActionButtons = ({
  task,
  onRunTask,
  onDeleteTask,
}: ActionButtonsProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();
  const { permissions } = useRole();

  const handleRunNow = async () => {
    if (task.status === "Running") {
      toast({
        title: "Task Already Running",
        description: "This task is currently in progress.",
        variant: "destructive",
      });
      return;
    }

    if (!permissions.canRun) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to run tasks.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setIsTransitioning(true);

    try {
      // Show start notification
      toast({
        title: "🚀 Task Started",
        description: `${task.name} is now running...`,
      });

      // Start the task
      await onRunTask(task.id);

      // Simulate realistic execution time (3 seconds)
      setTimeout(() => {
        setIsTransitioning(false);

        // Randomly determine success/failure (90% success rate)
        const success = Math.random() > 0.1;

        if (success) {
          toast({
            title: (
              <div className="flex items-center gap-2">
                <TaskCompleteIcon size="sm" className="h-4 w-4" />
                Task Completed Successfully
              </div>
            ),
            description: `${task.name} finished executing in ${Math.floor(Math.random() * 30 + 15)} seconds.`,
          });
        } else {
          toast({
            title: "❌ Task Failed",
            description: `${task.name} encountered an error during execution.`,
            variant: "destructive",
          });
        }
      }, 3000);
    } catch (error) {
      setIsTransitioning(false);
      toast({
        title: "❌ Execution Error",
        description: `${task.name} could not be started. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleViewLogs = () => {
    if (!permissions.canViewLogs) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to view logs.",
        variant: "destructive",
      });
      return;
    }

    console.log(`=== LOGS FOR ${task.name.toUpperCase()} ===`);
    console.log(`Task ID: ${task.id}`);
    console.log(`Status: ${task.status}`);
    console.log(`Last Run: ${task.lastRunTime || "Never"}`);
    console.log(`Category: ${task.category}`);
    console.log(`Triggered By: ${task.triggeredBy}`);
    console.log("=== END LOGS ===");

    toast({
      title: "📋 Logs Retrieved",
      description: `Execution logs for "${task.name}" are displayed in the browser console.`,
    });
  };

  const handleEditConfig = () => {
    if (!permissions.canEdit) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit tasks.",
        variant: "destructive",
      });
      return;
    }

    console.log(`Editing configuration for task: ${task.name}`, {
      id: task.id,
      currentConfig: {
        triggerType: task.triggerType,
        category: task.category,
        status: task.status,
      },
    });

    toast({
      title: "⚙️ Configuration Panel",
      description: `Configuration details for "${task.name}" are available in the dropdown menu.`,
    });
  };

  const handleDelete = () => {
    if (!permissions.canDelete) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete tasks.",
        variant: "destructive",
      });
      return;
    }

    onDeleteTask(task.id);
    toast({
      title: "🗑️ Task Deleted",
      description: `"${task.name}" has been permanently removed from your automation dashboard.`,
      variant: "destructive",
    });
  };

  const isTaskRunning = task.status === "Running" || isRunning;

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Primary Action - Run Now */}
      {permissions.canRun && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            onClick={handleRunNow}
            disabled={isTaskRunning}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 relative overflow-hidden"
          >
            {/* Animated background for running state */}
            {isTransitioning && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}

            {isTaskRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {isTaskRunning ? "Running..." : "Run Now"}
          </Button>
        </motion.div>
      )}

      {/* Secondary Actions */}
      {permissions.canViewLogs && (
        <TaskDetailModal
          task={task}
          trigger={
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-md"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            </motion.div>
          }
        />
      )}

      {permissions.canViewLogs && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={handleViewLogs}
            className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-md"
          >
            <FileText className="h-4 w-4" />
            View Logs
          </Button>
        </motion.div>
      )}

      {permissions.canEdit && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            size="sm"
            variant="outline"
            onClick={handleEditConfig}
            className="flex items-center gap-2 border-slate-300 hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800 transition-all duration-200 hover:shadow-md"
          >
            <Wrench className="h-4 w-4" />
            Configure
          </Button>
        </motion.div>
      )}

      {/* Delete Action with Confirmation */}
      {permissions.canDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-950/50 transition-all duration-200 hover:shadow-md"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </motion.div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-red-500" />
                Delete Automation Task
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>
                  Are you sure you want to permanently delete{" "}
                  <strong>"{task.name}"</strong>?
                </p>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800 dark:text-red-400">
                      <p className="font-medium">
                        This action cannot be undone.
                      </p>
                      <p>
                        The task will be permanently removed from your dashboard
                        and all associated history will be lost.
                      </p>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Task
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </motion.div>
  );
};
