import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  History,
  Activity,
  Calendar,
  Timer,
  User,
} from "lucide-react";
import { AutomatedTask } from "@/types/task";
import { AnimatedStatusBadge } from "./AnimatedStatusBadge";
import { WorkflowTimeline } from "./WorkflowTimeline";
import { TaskCompleteIcon } from "./icons/TaskCompleteIcon";
import { format, formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

interface TaskDetailModalProps {
  task: AutomatedTask;
  trigger?: React.ReactNode;
}

// Mock task history data
const generateTaskHistory = (task: AutomatedTask) => {
  const history = [];
  const now = new Date();

  for (let i = 0; i < 10; i++) {
    const runTime = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const statuses: (typeof task.status)[] = [
      "Completed",
      "Completed",
      "Failed",
      "Completed",
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    history.push({
      id: `run-${i}`,
      startTime: runTime,
      endTime: new Date(runTime.getTime() + Math.random() * 300000 + 30000),
      status: randomStatus,
      duration: Math.random() * 300000 + 30000,
      triggeredBy: i === 0 ? "Manual Run" : "Scheduled",
      output:
        randomStatus === "Failed"
          ? "Error: Connection timeout"
          : "Task completed successfully",
    });
  }

  return history;
};

// Mock log data
const generateLogs = (task: AutomatedTask) => {
  const logs = [
    "[2024-01-15 08:00:01] INFO: Task execution started",
    "[2024-01-15 08:00:02] INFO: Initializing connection to data source",
    "[2024-01-15 08:00:03] INFO: Connection established successfully",
    "[2024-01-15 08:00:05] INFO: Processing 1,245 records",
    "[2024-01-15 08:00:12] INFO: Batch 1/5 completed (249 records)",
    "[2024-01-15 08:00:18] INFO: Batch 2/5 completed (249 records)",
    "[2024-01-15 08:00:25] WARNING: Duplicate record found, skipping ID: 12847",
    "[2024-01-15 08:00:31] INFO: Batch 3/5 completed (248 records)",
    "[2024-01-15 08:00:38] INFO: Batch 4/5 completed (249 records)",
    "[2024-01-15 08:00:44] INFO: Batch 5/5 completed (249 records)",
    "[2024-01-15 08:00:46] INFO: Updating indexes and cache",
    "[2024-01-15 08:00:48] INFO: Sending completion notification",
    "[2024-01-15 08:00:49] INFO: Task execution completed successfully",
    "[2024-01-15 08:00:49] INFO: Total execution time: 48.2 seconds",
  ];

  if (task.status === "Failed") {
    logs.push(
      "[2024-01-15 08:00:50] ERROR: Failed to send notification",
      "[2024-01-15 08:00:50] ERROR: SMTP connection timeout",
      "[2024-01-15 08:00:50] ERROR: Task marked as failed",
    );
  }

  return logs;
};

export const TaskDetailModal = ({ task, trigger }: TaskDetailModalProps) => {
  const [open, setOpen] = useState(false);
  const history = generateTaskHistory(task);
  const logs = generateLogs(task);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <TaskCompleteIcon size="sm" className="h-4 w-4" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "Running":
        return <Activity className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-amber-500" />;
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <Eye className="h-4 w-4" />
      View Details
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5" />
            {task.name}
            <AnimatedStatusBadge status={task.status} />
          </DialogTitle>
          <DialogDescription className="text-base">
            {task.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Task Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline">{task.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trigger Type:</span>
                    <span>{task.triggerType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Triggered By:</span>
                    <span>{task.triggeredBy}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Execution Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Run:</span>
                    <span>
                      {task.lastRunTime
                        ? formatDistanceToNow(task.lastRunTime, {
                            addSuffix: true,
                          })
                        : "Never"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{formatDuration(task.executionTime)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Next Run:</span>
                    <span>
                      {task.nextRunTime
                        ? format(task.nextRunTime, "MMM d, h:mm a")
                        : "Manual only"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <WorkflowTimeline task={task} />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {history.map((run, index) => (
                  <motion.div
                    key={run.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(run.status)}
                            <div>
                              <div className="font-medium">
                                Run #{history.length - index}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(
                                  run.startTime,
                                  "MMM d, yyyy 'at' h:mm a",
                                )}
                              </div>
                            </div>
                          </div>
                          <Badge
                            variant={
                              run.status === "Completed"
                                ? "default"
                                : "destructive"
                            }
                            className="text-xs"
                          >
                            {run.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Duration:</span>
                            <div>{formatDuration(run.duration)}</div>
                          </div>
                          <div>
                            <span className="font-medium">Triggered By:</span>
                            <div>{run.triggeredBy}</div>
                          </div>
                          <div>
                            <span className="font-medium">Output:</span>
                            <div
                              className={
                                run.status === "Failed"
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              {run.output}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <div className="p-4 font-mono text-sm space-y-1">
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`py-1 px-2 rounded ${
                      log.includes("ERROR")
                        ? "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-400"
                        : log.includes("WARNING")
                          ? "bg-yellow-50 text-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400"
                          : "text-foreground"
                    }`}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
