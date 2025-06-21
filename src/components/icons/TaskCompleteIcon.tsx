import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TaskCompleteIconProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  gradient?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

export const TaskCompleteIcon = ({
  className,
  size = "md",
  animated = true,
  gradient = true,
}: TaskCompleteIconProps) => {
  const iconId = `complete-icon-${Math.random().toString(36).substr(2, 9)}`;

  const IconComponent = animated ? motion.svg : "svg";

  return (
    <IconComponent
      className={cn(sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...(animated && {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: {
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 15,
        },
      })}
    >
      <defs>
        {gradient && (
          <>
            <linearGradient
              id={`gradient-${iconId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient
              id={`gradient-glow-${iconId}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
            <filter id={`glow-${iconId}`}>
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </>
        )}
      </defs>

      {/* Outer glow circle */}
      {gradient && (
        <motion.circle
          cx="12"
          cy="12"
          r="10"
          fill={`url(#gradient-glow-${iconId})`}
          filter={`url(#glow-${iconId})`}
          {...(animated && {
            initial: { scale: 0.8, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            transition: { delay: 0.1, duration: 0.4 },
          })}
        />
      )}

      {/* Main circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        fill={gradient ? `url(#gradient-${iconId})` : "#10b981"}
        stroke="#ffffff"
        strokeWidth="1.5"
        {...(animated && {
          initial: { scale: 0.5, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { delay: 0.15, duration: 0.3, type: "spring" },
        })}
      />

      {/* Checkmark */}
      <motion.path
        d="M8.5 12.5l2.5 2.5 5-5"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        {...(animated && {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            delay: 0.3,
            duration: 0.4,
            ease: "easeInOut",
          },
        })}
      />

      {/* Highlight */}
      {gradient && (
        <motion.ellipse
          cx="9"
          cy="8"
          rx="2"
          ry="1.5"
          fill="#ffffff"
          opacity="0.3"
          transform="rotate(-25 9 8)"
          {...(animated && {
            initial: { scale: 0, opacity: 0 },
            animate: { scale: 1, opacity: 0.3 },
            transition: { delay: 0.5, duration: 0.3 },
          })}
        />
      )}
    </IconComponent>
  );
};

// Alternative simpler version for smaller contexts
export const TaskCompleteIconSimple = ({
  className,
  size = "md",
}: Pick<TaskCompleteIconProps, "className" | "size">) => {
  return (
    <motion.div
      className={cn("relative inline-flex", sizeClasses[size])}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <svg
        className={cn("w-full h-full", className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="#10b981"
          className="drop-shadow-sm"
        />
        <motion.path
          d="M8.5 12.5l2.5 2.5 5-5"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        />
      </svg>

      {/* Subtle pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-green-400 opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};
