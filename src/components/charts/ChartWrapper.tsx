import { useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Hook to suppress specific Recharts warnings
const useSupressRechartsWarnings = () => {
  useEffect(() => {
    const originalConsoleWarn = console.warn;

    console.warn = (...args) => {
      if (
        typeof args[0] === "string" &&
        args[0].includes("Support for defaultProps will be removed") &&
        (args[0].includes("XAxis") || args[0].includes("YAxis"))
      ) {
        // Suppress Recharts defaultProps warnings
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    return () => {
      console.warn = originalConsoleWarn;
    };
  }, []);
};

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface CategoryData {
  category: string;
  count: number;
}

interface EnhancedPieChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
}

interface EnhancedBarChartProps {
  data: CategoryData[];
  width?: number;
  height?: number;
}

export const EnhancedPieChart = ({
  data,
  width = 400,
  height = 300,
}: EnhancedPieChartProps) => {
  useSupressRechartsWarnings();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={width} height={height}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value, percent }) =>
            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
          }
          outerRadius={80}
          innerRadius={0}
          fill="#8884d8"
          dataKey="value"
          animationBegin={0}
          animationDuration={800}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || "#8884d8"} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const EnhancedBarChart = ({
  data,
  width = 500,
  height = 300,
}: EnhancedBarChartProps) => {
  useSupressRechartsWarnings();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        width={width}
        height={height}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          className="opacity-30"
          stroke="currentColor"
        />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          axisLine={true}
          tickLine={true}
          type="category"
          interval={0}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          className="text-muted-foreground"
          axisLine={true}
          tickLine={true}
          type="number"
          domain={[0, "dataMax"]}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
        />
        <Bar
          dataKey="count"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
          className="transition-all duration-200"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
