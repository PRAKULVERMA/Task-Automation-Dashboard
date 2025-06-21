import { AutomatedTask } from "@/types/task";
import { TaskFormData } from "@/schemas/taskSchema";
import { TaskCard } from "./TaskCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Activity,
  X,
  Tag,
} from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskListProps {
  tasks: AutomatedTask[];
  onRunTask: (taskId: string) => Promise<void>;
  onDeleteTask: (taskId: string) => void;
  onUpdateTask: (taskId: string, data: TaskFormData) => void;
}

type SortField = "lastRunTime" | "status" | "name" | "category";
type SortOrder = "asc" | "desc";

export const TaskList = ({
  tasks,
  onRunTask,
  onDeleteTask,
  onUpdateTask,
}: TaskListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("lastRunTime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const categories = ["HR", "Finance", "Operations", "Marketing", "IT"];
  const statuses = ["Running", "Completed", "Failed", "Scheduled"];

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter((task) => {
      // Search filter
      const matchesSearch =
        task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.triggeredBy.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      // Category filter
      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(task.category);

      return matchesSearch && matchesStatus && matchesCategory;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "lastRunTime":
          aValue = a.lastRunTime ? new Date(a.lastRunTime).getTime() : 0;
          bValue = b.lastRunTime ? new Date(b.lastRunTime).getTime() : 0;
          break;
        case "status":
          // Define status priority for sorting
          const statusPriority = {
            Running: 4,
            Failed: 3,
            Scheduled: 2,
            Completed: 1,
          };
          aValue = statusPriority[a.status];
          bValue = statusPriority[b.status];
          break;
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tasks, searchQuery, statusFilter, categoryFilter, sortField, sortOrder]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter([]);
  };

  const activeFiltersCount =
    (searchQuery ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    categoryFilter.length;

  const SortButton = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => (
    <Button
      variant={sortField === field ? "default" : "outline"}
      size="sm"
      onClick={() => toggleSort(field)}
      className="flex items-center gap-1"
    >
      {children}
      {sortField === field &&
        (sortOrder === "asc" ? (
          <SortAsc className="h-3 w-3" />
        ) : (
          <SortDesc className="h-3 w-3" />
        ))}
    </Button>
  );

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks by name, description, or trigger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-11"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <ToggleGroup
              type="multiple"
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              className="flex-wrap"
            >
              {categories.map((category) => (
                <ToggleGroupItem
                  key={category}
                  value={category}
                  size="sm"
                  className="text-xs"
                >
                  {category}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="h-3 w-3 mr-1" />
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <SortButton field="lastRunTime">
            <Calendar className="h-3 w-3" />
            Last Run
          </SortButton>
          <SortButton field="status">
            <Activity className="h-3 w-3" />
            Status
          </SortButton>
          <SortButton field="name">Name</SortButton>
          <SortButton field="category">
            <Tag className="h-3 w-3" />
            Category
          </SortButton>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchQuery}"
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Status: {statusFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setStatusFilter("all")}
              />
            </Badge>
          )}
          {categoryFilter.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {category}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() =>
                  setCategoryFilter((prev) =>
                    prev.filter((c) => c !== category),
                  )
                }
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedTasks.length} of {tasks.length} tasks
        {sortField && (
          <span className="ml-2">
            • Sorted by {sortField} (
            {sortOrder === "asc" ? "ascending" : "descending"})
          </span>
        )}
      </div>

      {/* Task Cards with Animation */}
      <AnimatePresence mode="popLayout">
        {filteredAndSortedTasks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
          >
            <div className="text-muted-foreground">
              {tasks.length === 0
                ? "No tasks available"
                : "No tasks match your current filters"}
            </div>
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedTasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  layout: { duration: 0.3 },
                }}
              >
                <TaskCard
                  task={task}
                  onRunTask={onRunTask}
                  onDeleteTask={onDeleteTask}
                  onUpdateTask={onUpdateTask}
                />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
