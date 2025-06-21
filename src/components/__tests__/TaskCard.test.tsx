import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TaskCard } from "../TaskCard";
import { AutomatedTask } from "@/types/task";
import { TaskFormData } from "@/schemas/taskSchema";
import { RoleProvider } from "@/contexts/RoleContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

// Mock all complex dependencies
vi.mock("../AnimatedStatusBadge", () => ({
  AnimatedStatusBadge: ({ status }: { status: string }) => (
    <div data-testid="status-badge">{status}</div>
  ),
}));

vi.mock("../ActionButtons", () => ({
  ActionButtons: ({ task, onRunTask }: any) => (
    <div data-testid="action-buttons">
      <button onClick={() => onRunTask(task.id)}>Run Now</button>
      <button>View Logs</button>
      <button>Configure</button>
      <button>Delete</button>
    </div>
  ),
}));

vi.mock("../TaskFormModal", () => ({
  TaskFormModal: ({ trigger }: any) => trigger,
}));

vi.mock("../TaskDetailModal", () => ({
  TaskDetailModal: ({ trigger }: any) => trigger,
}));

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock date-fns
vi.mock("date-fns", () => ({
  formatDistanceToNow: () => "2 hours ago",
  format: () => "Jan 15, 2024 8:00 AM",
}));

const mockTask: AutomatedTask = {
  id: "test-task-1",
  name: "Test Automation Task",
  description: "This is a test automation task for unit testing",
  status: "Completed",
  lastRunTime: new Date("2024-01-15T08:00:00Z"),
  triggeredBy: "Test System",
  triggerType: "Daily",
  nextRunTime: new Date("2024-01-16T08:00:00Z"),
  executionTime: 45000,
  category: "HR",
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light">
        <RoleProvider>{children}</RoleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

describe("TaskCard Component", () => {
  const mockOnRunTask = vi.fn();
  const mockOnDeleteTask = vi.fn();
  const mockOnUpdateTask = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders task information correctly", () => {
    render(
      <TestWrapper>
        <TaskCard
          task={mockTask}
          onRunTask={mockOnRunTask}
          onDeleteTask={mockOnDeleteTask}
          onUpdateTask={mockOnUpdateTask}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Test Automation Task")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test automation task for unit testing"),
    ).toBeInTheDocument();
    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("Test System")).toBeInTheDocument();
    expect(screen.getByText("Daily")).toBeInTheDocument();
  });

  it("displays correct status badge", () => {
    render(
      <TestWrapper>
        <TaskCard
          task={mockTask}
          onRunTask={mockOnRunTask}
          onDeleteTask={mockOnDeleteTask}
          onUpdateTask={mockOnUpdateTask}
        />
      </TestWrapper>,
    );

    const statusBadge = screen.getByTestId("status-badge");
    expect(statusBadge).toHaveTextContent("Completed");
  });

  it("shows execution time correctly", () => {
    render(
      <TestWrapper>
        <TaskCard
          task={mockTask}
          onRunTask={mockOnRunTask}
          onDeleteTask={mockOnDeleteTask}
          onUpdateTask={mockOnUpdateTask}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("45s")).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(
      <TestWrapper>
        <TaskCard
          task={mockTask}
          onRunTask={mockOnRunTask}
          onDeleteTask={mockOnDeleteTask}
          onUpdateTask={mockOnUpdateTask}
        />
      </TestWrapper>,
    );

    expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
    expect(screen.getByText("Run Now")).toBeInTheDocument();
    expect(screen.getByText("View Logs")).toBeInTheDocument();
    expect(screen.getByText("Configure")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("handles task execution when Run Now is clicked", async () => {
    render(
      <TestWrapper>
        <TaskCard
          task={mockTask}
          onRunTask={mockOnRunTask}
          onDeleteTask={mockOnDeleteTask}
          onUpdateTask={mockOnUpdateTask}
        />
      </TestWrapper>,
    );

    const runButton = screen.getByText("Run Now");
    fireEvent.click(runButton);

    await waitFor(() => {
      expect(mockOnRunTask).toHaveBeenCalledWith("test-task-1");
    });
  });

  it("shows next run time when available", () => {
    render(
      <TestWrapper>
        <TaskCard
          task={mockTask}
          onRunTask={mockOnRunTask}
          onDeleteTask={mockOnDeleteTask}
          onUpdateTask={mockOnUpdateTask}
        />
      </TestWrapper>,
    );

    expect(screen.getByText("Next scheduled run:")).toBeInTheDocument();
  });

  it("renders different status correctly", () => {
    const runningTask = { ...mockTask, status: "Running" as const };

    render(
      <TestWrapper>
        <TaskCard
          task={runningTask}
          onRunTask={mockOnRunTask}
          onDeleteTask={mockOnDeleteTask}
          onUpdateTask={mockOnUpdateTask}
        />
      </TestWrapper>,
    );

    const statusBadge = screen.getByTestId("status-badge");
    expect(statusBadge).toHaveTextContent("Running");
  });
});
