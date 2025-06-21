import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/task";
import { CheckCircle2, XCircle, Clock, Play, Loader2 } from "lucide-react";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

const statusConfig = {
  Running: {
    variant: "default" as const,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: Loader2,
    iconClass: "animate-spin",
  },
  Completed: {
    variant: "default" as const,
    color: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
    iconClass: "",
  },
  Failed: {
    variant: "destructive" as const,
    color: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    iconClass: "",
  },
  Scheduled: {
    variant: "secondary" as const,
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
    iconClass: "",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border",
        config.color,
        className,
      )}
    >
      <Icon className={cn("h-3 w-3", config.iconClass)} />
      {status}
    </Badge>
  );
};
