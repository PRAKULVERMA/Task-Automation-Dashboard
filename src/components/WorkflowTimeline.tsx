import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AutomatedTask } from "@/types/task";
import {
  Clock,
  PlayCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Zap,
} from "lucide-react";
import { TaskCompleteIcon } from "./icons/TaskCompleteIcon";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { motion } from "framer-motion";

interface TimelineItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "current" | "upcoming" | "failed";
  badge?: React.ReactNode;
}

const TimelineItem = ({
  icon,
  title,
  description,
  timestamp,
  status,
  badge,
}: TimelineItemProps) => {
  const statusStyles = {
    completed: {
      iconBg:
        "bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400",
      line: "bg-green-300 dark:bg-green-700",
      content: "text-foreground",
    },
    current: {
      iconBg:
        "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      line: "bg-blue-300 dark:bg-blue-700",
      content: "text-foreground font-medium",
    },
    upcoming: {
      iconBg:
        "bg-gray-100 text-gray-400 dark:bg-gray-950/50 dark:text-gray-500",
      line: "bg-gray-200 dark:bg-gray-700",
      content: "text-muted-foreground",
    },
    failed: {
      iconBg: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
      line: "bg-red-300 dark:bg-red-700",
      content: "text-foreground",
    },
  };

  const style = statusStyles[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative flex items-start space-x-4 pb-6"
    >
      {/* Timeline line */}
      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-border"></div>

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background ${style.iconBg}`}
      >
        {icon}
      </motion.div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className={`text-sm font-medium ${style.content}`}>{title}</h4>
          {badge && <div>{badge}</div>}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </motion.div>
  );
};

interface WorkflowTimelineProps {
  task: AutomatedTask;
}

export const WorkflowTimeline = ({ task }: WorkflowTimelineProps) => {
  const now = new Date();

  // Generate timeline items based on task data
  const timelineItems: TimelineItemProps[] = [];

  // Last run
  if (task.lastRunTime) {
    const wasSuccessful = task.status === "Completed";
    timelineItems.push({
      icon: wasSuccessful ? (
        <TaskCompleteIcon size="md" className="h-5 w-5" />
      ) : (
        <XCircle className="h-5 w-5" />
      ),
      title: "Last Execution",
      description: `Task ${wasSuccessful ? "completed successfully" : "failed"} - Duration: ${Math.floor(task.executionTime / 1000)}s`,
      timestamp: `${formatDistanceToNow(task.lastRunTime)} ago (${format(task.lastRunTime, "MMM d, h:mm a")})`,
      status: wasSuccessful ? "completed" : "failed",
      badge: (
        <Badge
          variant={wasSuccessful ? "default" : "destructive"}
          className="text-xs"
        >
          {task.status}
        </Badge>
      ),
    });
  }

  // Current status
  if (task.status === "Running") {
    timelineItems.push({
      icon: <Loader2 className="h-5 w-5 animate-spin" />,
      title: "Currently Running",
      description: "Task is executing now",
      timestamp: "In progress",
      status: "current",
      badge: (
        <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
          Running
        </Badge>
      ),
    });
  }

  // Manual trigger availability
  if (task.triggerType === "Manual") {
    timelineItems.push({
      icon: <User className="h-5 w-5" />,
      title: "Manual Trigger",
      description: "Task can be triggered manually at any time",
      timestamp: "Available now",
      status: task.status === "Running" ? "upcoming" : "current",
      badge: (
        <Badge variant="outline" className="text-xs">
          Manual
        </Badge>
      ),
    });
  }

  // Next scheduled run
  if (task.nextRunTime && task.triggerType !== "Manual") {
    const isOverdue = isBefore(task.nextRunTime, now);
    const isUpcoming = isAfter(task.nextRunTime, now);

    timelineItems.push({
      icon: <Calendar className="h-5 w-5" />,
      title: isOverdue ? "Overdue Execution" : "Next Scheduled Run",
      description: `Automatic ${task.triggerType.toLowerCase()} execution`,
      timestamp: isOverdue
        ? `Overdue by ${formatDistanceToNow(task.nextRunTime)} (${format(task.nextRunTime, "MMM d, h:mm a")})`
        : `In ${formatDistanceToNow(task.nextRunTime)} (${format(task.nextRunTime, "MMM d, h:mm a")})`,
      status: isOverdue ? "failed" : "upcoming",
      badge: (
        <Badge
          variant={isOverdue ? "destructive" : "secondary"}
          className="text-xs"
        >
          {task.triggerType}
        </Badge>
      ),
    });
  }

  // Auto-retry information
  if (task.status === "Failed") {
    timelineItems.push({
      icon: <Zap className="h-5 w-5" />,
      title: "Auto-Retry Available",
      description: "Task can be retried automatically or manually",
      timestamp: "Ready for retry",
      status: "upcoming",
      badge: (
        <Badge variant="outline" className="text-xs">
          Retry
        </Badge>
      ),
    });
  }

  // Future scheduled runs (for recurring tasks)
  if (task.nextRunTime && task.triggerType !== "Manual") {
    const futureRun = new Date(task.nextRunTime);
    if (task.triggerType === "Daily") {
      futureRun.setDate(futureRun.getDate() + 1);
    } else if (task.triggerType === "Weekly") {
      futureRun.setDate(futureRun.getDate() + 7);
    }

    timelineItems.push({
      icon: <Clock className="h-5 w-5" />,
      title: "Future Execution",
      description: `Next ${task.triggerType.toLowerCase()} run`,
      timestamp: `In ${formatDistanceToNow(futureRun)} (${format(futureRun, "MMM d, h:mm a")})`,
      status: "upcoming",
      badge: (
        <Badge variant="outline" className="text-xs">
          Scheduled
        </Badge>
      ),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <PlayCircle className="h-5 w-5" />
          Workflow Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timelineItems.length > 0 ? (
          <div className="space-y-2">
            {timelineItems.map((item, index) => (
              <div key={index}>
                <TimelineItem {...item} />
                {index < timelineItems.length - 1 && (
                  <Separator className="ml-5 opacity-30" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No timeline data available</p>
              <p className="text-xs">Task has not been executed yet</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
