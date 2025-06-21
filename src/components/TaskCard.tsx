import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AutomatedTask } from "@/types/task";
import { TaskFormData } from "@/schemas/taskSchema";
import { AnimatedStatusBadge } from "./AnimatedStatusBadge";
import { ActionButtons } from "./ActionButtons";
import { TaskFormModal } from "./TaskFormModal";
import { TaskDetailModal } from "./TaskDetailModal";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  User,
  Calendar,
  Timer,
  Tag,
  MoreVertical,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskCardProps {
  task: AutomatedTask;
  onRunTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, data: TaskFormData) => void;
}

const categoryColors = {
  HR: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
  Finance:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800",
  Operations:
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
  Marketing:
    "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-800",
  IT: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950/50 dark:text-gray-300 dark:border-gray-800",
};

const statusGradients = {
  Running: "border-l-blue-500",
  Completed: "border-l-green-500",
  Failed: "border-l-red-500",
  Scheduled: "border-l-amber-500",
};

export const TaskCard = ({
  task,
  onRunTask,
  onDeleteTask,
  onUpdateTask,
}: TaskCardProps) => {
  const formatExecutionTime = (ms: number) => {
    if (ms === 0) return "N/A";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  return (
    <Card
      className={`transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-l-4 ${statusGradients[task.status]} bg-gradient-to-r from-card to-card/90 backdrop-blur-sm`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <CardTitle className="text-xl font-bold tracking-tight">
                {task.name}
              </CardTitle>
              <Badge
                className={`text-xs font-medium ${categoryColors[task.category]} border shadow-sm`}
              >
                <Tag className="h-3 w-3 mr-1.5" />
                {task.category}
              </Badge>
            </div>
            <CardDescription className="text-sm text-muted-foreground leading-relaxed">
              {task.description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <AnimatedStatusBadge status={task.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <TaskDetailModal
                  task={task}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <MoreVertical className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  }
                />
                <TaskFormModal
                  mode="edit"
                  task={task}
                  onUpdate={onUpdateTask}
                  trigger={
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit Task
                    </DropdownMenuItem>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => console.log("Duplicate task")}>
                  Duplicate Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Export logs")}>
                  Export Logs
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4">
        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-foreground">
                  Triggered by:
                </span>
                <div className="text-muted-foreground">{task.triggeredBy}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-foreground">
                  Trigger Type:
                </span>
                <div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {task.triggerType}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-foreground">Last Run:</span>
                <div className="text-muted-foreground">
                  {task.lastRunTime
                    ? `${formatDistanceToNow(task.lastRunTime)} ago`
                    : "Never"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <span className="font-medium text-foreground">
                  Execution Time:
                </span>
                <div className="text-muted-foreground">
                  {formatExecutionTime(task.executionTime)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Run Time */}
        {task.nextRunTime && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <span className="font-semibold text-blue-900 dark:text-blue-100">
                  Next scheduled run:
                </span>
                <div className="text-blue-700 dark:text-blue-300 mt-1">
                  {format(task.nextRunTime, "PPpp")}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 border-t border-border/50">
          <ActionButtons
            task={task}
            onRunTask={onRunTask}
            onDeleteTask={onDeleteTask}
          />
        </div>
      </CardContent>
    </Card>
  );
};
