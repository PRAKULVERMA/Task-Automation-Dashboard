import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStats, AutomatedTask } from "@/types/task";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { TaskCompleteIcon } from "./icons/TaskCompleteIcon";
import { EnhancedPieChart, EnhancedBarChart } from "./charts/ChartWrapper";
import { isToday, isWithinInterval, subHours } from "date-fns";

interface DashboardStatsProps {
  stats: TaskStats;
  tasks: AutomatedTask[];
}

export const DashboardStats = ({ stats, tasks }: DashboardStatsProps) => {
  // Calculate time-based metrics
  const completedToday = tasks.filter(
    (task) =>
      task.status === "Completed" &&
      task.lastRunTime &&
      isToday(task.lastRunTime),
  ).length;

  const failedRecently = tasks.filter(
    (task) =>
      task.status === "Failed" &&
      task.lastRunTime &&
      isWithinInterval(task.lastRunTime, {
        start: subHours(new Date(), 24),
        end: new Date(),
      }),
  ).length;

  // Data for pie chart
  const pieData = [
    { name: "Completed", value: stats.completed, color: "#10b981" },
    { name: "Running", value: stats.running, color: "#3b82f6" },
    { name: "Failed", value: stats.failed, color: "#ef4444" },
    { name: "Scheduled", value: stats.scheduled, color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  // Data for category breakdown
  const categoryData = tasks.reduce(
    (acc, task) => {
      const existing = acc.find((item) => item.category === task.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ category: task.category, count: 1 });
      }
      return acc;
    },
    [] as { category: string; count: number }[],
  );

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800",
      description: "Active automations",
      emoji: "🟢",
    },
    {
      title: "Running Now",
      value: stats.running,
      icon: Loader2,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/50",
      borderColor: "border-blue-200 dark:border-blue-800",
      iconClass: "animate-spin",
      description: "Currently executing",
      emoji: "🚀",
    },
    {
      title: "Completed Today",
      value: completedToday,
      icon: TaskCompleteIcon,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/50",
      borderColor: "border-green-200 dark:border-green-800",
      description: "Finished today",
      emoji: "✅",
      customIcon: true,
    },
    {
      title: "Failed Recently",
      value: failedRecently,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950/50",
      borderColor: "border-red-200 dark:border-red-800",
      description: "Last 24 hours",
      emoji: "❌",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className={`transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 ${stat.borderColor} relative overflow-hidden`}
            >
              <div className={`absolute inset-0 ${stat.bgColor} opacity-50`} />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <div>
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <span className="text-lg">{stat.emoji}</span>
                    {stat.title}
                  </CardTitle>
                </div>
                <div
                  className={`p-2 rounded-full ${stat.bgColor} border ${stat.borderColor}`}
                >
                  {stat.title === "Completed Today" ? (
                    <TaskCompleteIcon
                      size="sm"
                      className="h-4 w-4"
                      animated={true}
                    />
                  ) : (
                    <Icon
                      className={`h-4 w-4 ${stat.color} ${stat.iconClass || ""}`}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Pie Chart */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <EnhancedPieChart data={pieData} />
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown Bar Chart */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Tasks by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <EnhancedBarChart data={categoryData} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
