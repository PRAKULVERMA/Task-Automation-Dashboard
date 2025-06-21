import { useState, useCallback, useEffect } from "react";
import { AutomatedTask, TaskStats, NewAutomationFormData } from "@/types/task";
import { TaskFormData } from "@/schemas/taskSchema";
import { mockTasks } from "@/data/mockTasks";

export const useTasks = () => {
  const [tasks, setTasks] = useState<AutomatedTask[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate async data loading
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      setTasks(mockTasks);
      setLoading(false);
    };

    loadTasks();
  }, []);

  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: AutomatedTask["status"]) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: newStatus,
                lastRunTime:
                  newStatus === "Running" ? new Date() : task.lastRunTime,
                executionTime:
                  newStatus === "Completed"
                    ? Math.random() * 120000 + 30000
                    : task.executionTime,
              }
            : task,
        ),
      );
    },
    [],
  );

  const runTask = useCallback(
    async (taskId: string) => {
      // Set to running
      updateTaskStatus(taskId, "Running");

      // Simulate task execution
      const executionTime = Math.random() * 3000 + 2000; // 2-5 seconds
      await new Promise((resolve) => setTimeout(resolve, executionTime));

      // Randomly succeed or fail (90% success rate)
      const success = Math.random() > 0.1;
      updateTaskStatus(taskId, success ? "Completed" : "Failed");
    },
    [updateTaskStatus],
  );

  // Legacy function for backward compatibility
  const addNewTask = useCallback((formData: NewAutomationFormData) => {
    const newTask: AutomatedTask = {
      id: `task-${Date.now()}`,
      name: formData.ruleName,
      status: "Scheduled",
      lastRunTime: null,
      triggeredBy: "User Created",
      description: formData.description,
      triggerType: formData.triggerType,
      nextRunTime:
        formData.triggerType === "Manual"
          ? null
          : new Date(Date.now() + 24 * 60 * 60 * 1000),
      executionTime: 0,
      category: formData.category,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    return newTask;
  }, []);

  // New function for comprehensive task creation using TaskFormData
  const createTask = useCallback((formData: TaskFormData) => {
    const newTask: AutomatedTask = {
      id: `task-${Date.now()}`,
      name: formData.name,
      status: formData.status || "Scheduled",
      lastRunTime: null,
      triggeredBy: formData.triggeredBy,
      description: formData.description,
      triggerType: formData.triggerType,
      nextRunTime:
        formData.triggerType === "Manual"
          ? null
          : new Date(Date.now() + 24 * 60 * 60 * 1000),
      executionTime: 0,
      category: formData.category,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
    return newTask;
  }, []);

  // Update existing task with new form data
  const updateTask = useCallback((taskId: string, formData: TaskFormData) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              name: formData.name,
              description: formData.description,
              triggerType: formData.triggerType,
              category: formData.category,
              triggeredBy: formData.triggeredBy,
              status: formData.status || task.status,
              nextRunTime:
                formData.triggerType === "Manual"
                  ? null
                  : task.nextRunTime ||
                    new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
          : task,
      ),
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  }, []);

  const getTaskStats = useCallback((): TaskStats => {
    return tasks.reduce(
      (stats, task) => {
        stats.total++;
        stats[task.status.toLowerCase() as keyof Omit<TaskStats, "total">]++;
        return stats;
      },
      { total: 0, running: 0, completed: 0, failed: 0, scheduled: 0 },
    );
  }, [tasks]);

  return {
    tasks,
    loading,
    runTask,
    updateTaskStatus,
    addNewTask, // Keep for backward compatibility
    createTask, // New comprehensive function
    updateTask, // New update function
    deleteTask,
    getTaskStats,
  };
};
