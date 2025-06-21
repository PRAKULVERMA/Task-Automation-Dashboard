import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTasks } from "../useTasks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createElement } from "react";

// Mock the mock data
vi.mock("@/data/mockTasks", () => ({
  mockTasks: [
    {
      id: "task-1",
      name: "Test Task 1",
      status: "Scheduled",
      lastRunTime: new Date("2024-01-15T08:00:00Z"),
      triggeredBy: "System",
      description: "Test task description",
      triggerType: "Daily",
      executionTime: 30000,
      category: "HR",
    },
    {
      id: "task-2",
      name: "Test Task 2",
      status: "Completed",
      lastRunTime: new Date("2024-01-15T09:00:00Z"),
      triggeredBy: "User",
      description: "Another test task",
      triggerType: "Manual",
      executionTime: 45000,
      category: "Finance",
    },
  ],
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return function TestWrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
};

describe("useTasks Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with loading state", () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.tasks).toEqual([]);
  });

  it("loads tasks after initial delay", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    // Fast-forward the loading delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.tasks).toHaveLength(2);
    expect(result.current.tasks[0].name).toBe("Test Task 1");
  });

  it("updates task status correctly", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    // Wait for tasks to load
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Update task status
    act(() => {
      result.current.updateTaskStatus("task-1", "Running");
    });

    const updatedTask = result.current.tasks.find((t) => t.id === "task-1");
    expect(updatedTask?.status).toBe("Running");
    expect(updatedTask?.lastRunTime).toBeInstanceOf(Date);
  });

  it("calculates task statistics correctly", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    // Wait for tasks to load
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const stats = result.current.getTaskStats();
    expect(stats.total).toBe(2);
    expect(stats.scheduled).toBe(1);
    expect(stats.completed).toBe(1);
    expect(stats.running).toBe(0);
    expect(stats.failed).toBe(0);
  });

  it("deletes task correctly", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: createWrapper(),
    });

    // Wait for tasks to load
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const initialCount = result.current.tasks.length;

    act(() => {
      result.current.deleteTask("task-1");
    });

    expect(result.current.tasks).toHaveLength(initialCount - 1);
    expect(result.current.tasks.find((t) => t.id === "task-1")).toBeUndefined();
  });
});
