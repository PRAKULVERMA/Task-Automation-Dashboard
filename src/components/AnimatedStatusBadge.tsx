import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/task";
import { CheckCircle2, XCircle, Clock, Play, Loader2 } from "lucide-react";
import { TaskCompleteIconSimple } from "./icons/TaskCompleteIcon";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedStatusBadgeProps {
  status: TaskStatus;
  className?: string;
  isTransitioning?: boolean;
}

const statusConfig = {
  Running: {
    variant: "default" as const,
    color:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
    icon: Loader2,
    iconClass: "animate-spin",
    pulseColor: "bg-blue-500",
  },
  Completed: {
    variant: "default" as const,
    color:
      "bg-green-100 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-800",
    icon: TaskCompleteIconSimple,
    iconClass: "",
    pulseColor: "bg-green-500",
    useCustomIcon: true,
  },
  Failed: {
    variant: "destructive" as const,
    color:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
    iconClass: "",
    pulseColor: "bg-red-500",
  },
  Scheduled: {
    variant: "secondary" as const,
    color:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
    icon: Clock,
    iconClass: "",
    pulseColor: "bg-amber-500",
  },
};

export const AnimatedStatusBadge = ({
  status,
  className,
  isTransitioning,
}: AnimatedStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Animated pulse ring for running status */}
      <AnimatePresence>
        {(status === "Running" || isTransitioning) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 -m-1"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={cn(
                "absolute inset-0 rounded-full",
                config.pulseColor,
                "opacity-20",
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main badge with status transition animation */}
      <motion.div
        layout
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Badge
          variant={config.variant}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border relative overflow-hidden",
            config.color,
            className,
          )}
        >
          {/* Background shimmer for transitions */}
          {isTransitioning && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            />
          )}

          <motion.div
            animate={status === "Running" ? { rotate: 360 } : { rotate: 0 }}
            transition={{
              duration: status === "Running" ? 2 : 0.3,
              repeat: status === "Running" ? Infinity : 0,
              ease: "linear",
            }}
          >
            {status === "Completed" ? (
              <TaskCompleteIconSimple size="sm" className="w-3 h-3" />
            ) : (
              <Icon className={cn("h-3 w-3", config.iconClass)} />
            )}
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {status}
          </motion.span>
        </Badge>
      </motion.div>
    </div>
  );
};
