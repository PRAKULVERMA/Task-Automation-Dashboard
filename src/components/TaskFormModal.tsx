import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit3,
  Save,
  X,
  AlertCircle,
  Settings,
  Clock,
  Bell,
  RotateCcw,
} from "lucide-react";
import {
  taskFormSchema,
  TaskFormData,
  defaultTaskValues,
} from "@/schemas/taskSchema";
import { AutomatedTask } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TaskFormModalProps {
  mode?: "add" | "edit";
  task?: AutomatedTask;
  trigger?: React.ReactNode;
  onSubmit: (data: TaskFormData) => void;
  onUpdate?: (taskId: string, data: TaskFormData) => void;
}

export const TaskFormModal = ({
  mode = "add",
  task,
  trigger,
  onSubmit,
  onUpdate,
}: TaskFormModalProps) => {
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  const isEditMode = mode === "edit" && task;

  // Smart default values - use task data when editing, defaults when adding
  const getDefaultValues = (): TaskFormData => {
    if (isEditMode) {
      return {
        name: task.name,
        description: task.description,
        triggerType: task.triggerType,
        category: task.category,
        triggeredBy: task.triggeredBy,
        status: task.status,
        priority: "Medium",
        enableNotifications: true,
        retryAttempts: 3,
        timeoutMinutes: 30,
      };
    }
    return { ...defaultTaskValues } as TaskFormData;
  };

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: getDefaultValues(),
  });

  // Reset form when task changes (for edit mode)
  useEffect(() => {
    if (isEditMode) {
      form.reset(getDefaultValues());
    }
  }, [task?.id, isEditMode]);

  const handleSubmit = (data: TaskFormData) => {
    try {
      if (isEditMode && task && onUpdate) {
        onUpdate(task.id, data);
        toast({
          title: "Task Updated",
          description: `"${data.name}" has been updated successfully.`,
        });
      } else {
        onSubmit(data);
        toast({
          title: "Task Created",
          description: `"${data.name}" has been created successfully.`,
        });
      }

      form.reset();
      setOpen(false);
      setShowAdvanced(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    form.reset();
    setOpen(false);
    setShowAdvanced(false);
  };

  const defaultTrigger = (
    <Button className="flex items-center gap-2">
      {isEditMode ? (
        <>
          <Edit3 className="h-4 w-4" />
          Edit Task
        </>
      ) : (
        <>
          <Plus className="h-4 w-4" />
          New Task
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <>
                <Edit3 className="h-5 w-5" />
                Edit Task
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Create New Task
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? `Update the configuration for "${task?.name}"`
              : "Configure a new automation task with trigger settings and execution parameters."}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Basic Information</h3>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Task Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter task name..."
                          {...field}
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, descriptive name for your automation task
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this automation does..."
                          className="min-h-[100px] transition-all focus:ring-2 focus:ring-primary/20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Detailed explanation of the task's purpose and
                        functionality
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="HR">HR</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Operations">
                              Operations
                            </SelectItem>
                            <SelectItem value="Marketing">Marketing</SelectItem>
                            <SelectItem value="IT">IT</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="triggeredBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Triggered By *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., HRMS System"
                            {...field}
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Trigger Configuration */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Trigger Configuration</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="triggerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trigger Type *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select trigger" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How often this task should run automatically
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Low">
                              <Badge
                                variant="outline"
                                className="text-gray-600"
                              >
                                Low
                              </Badge>
                            </SelectItem>
                            <SelectItem value="Medium">
                              <Badge
                                variant="outline"
                                className="text-yellow-600"
                              >
                                Medium
                              </Badge>
                            </SelectItem>
                            <SelectItem value="High">
                              <Badge variant="outline" className="text-red-600">
                                High
                              </Badge>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm"
                >
                  <Settings className="h-4 w-4" />
                  Advanced Settings
                  <Badge variant="secondary" className="ml-2">
                    {showAdvanced ? "Hide" : "Show"}
                  </Badge>
                </Button>

                {showAdvanced && (
                  <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="retryAttempts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <RotateCcw className="h-4 w-4" />
                              Retry Attempts
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="transition-all focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormDescription>
                              Number of retry attempts on failure (0-5)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeoutMinutes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              Timeout (minutes)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="1440"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                className="transition-all focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormDescription>
                              Maximum execution time (1-1440 minutes)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="enableNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base flex items-center gap-2">
                              <Bell className="h-4 w-4" />
                              Enable Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive notifications when this task completes or
                              fails
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="flex items-center gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={form.formState.isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {form.formState.isSubmitting
              ? "Saving..."
              : isEditMode
                ? "Update Task"
                : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
