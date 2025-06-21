import { useTasks } from "@/hooks/useTasks";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardStats } from "@/components/DashboardStats";
import { TaskList } from "@/components/TaskList";
import { Skeleton } from "@/components/ui/skeleton";

const Index = () => {
  const {
    tasks,
    loading,
    runTask,
    addNewTask,
    createTask,
    updateTask,
    deleteTask,
    getTaskStats,
  } = useTasks();
  const stats = getTaskStats();

  const handleRefresh = () => {
    // In a real app, this would reload data from the API
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Skeleton className="h-8 w-80" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-32" />
              </div>
            </div>

            {/* Stats Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>

            {/* Task Cards Skeleton */}
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <DashboardHeader
            onAddTask={addNewTask}
            onCreateTask={createTask}
            onRefresh={handleRefresh}
            isLoading={loading}
          />

          {/* Statistics */}
          <DashboardStats stats={stats} tasks={tasks} />

          {/* Task List */}
          <TaskList
            tasks={tasks}
            onRunTask={runTask}
            onDeleteTask={deleteTask}
            onUpdateTask={updateTask}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
