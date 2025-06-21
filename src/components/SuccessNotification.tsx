import { motion } from "framer-motion";
import { TaskCompleteIcon } from "./icons/TaskCompleteIcon";
import { cn } from "@/lib/utils";

interface SuccessNotificationProps {
  title: string;
  description?: string;
  className?: string;
  onComplete?: () => void;
}

export const SuccessNotification = ({
  title,
  description,
  className,
  onComplete,
}: SuccessNotificationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className={cn(
        "flex items-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-green-200 dark:border-green-800 relative overflow-hidden",
        className,
      )}
      onAnimationComplete={() => {
        setTimeout(() => onComplete?.(), 3000);
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20" />

      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          delay: 0.2,
          duration: 0.5,
          type: "spring",
          stiffness: 200,
        }}
      >
        <TaskCompleteIcon
          size="lg"
          className="relative z-10"
          animated={true}
          gradient={true}
        />
      </motion.div>

      {/* Content */}
      <div className="flex-1 relative z-10">
        <motion.h4
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="font-semibold text-green-800 dark:text-green-200"
        >
          {title}
        </motion.h4>

        {description && (
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="text-sm text-green-600 dark:text-green-300 mt-1"
          >
            {description}
          </motion.p>
        )}
      </div>

      {/* Animated border */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 origin-left"
        style={{ width: "100%" }}
      />

      {/* Sparkle effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          delay: 0.5,
          duration: 1.5,
          repeat: 2,
          ease: "easeInOut",
        }}
        className="absolute top-2 right-2 text-yellow-400"
      >
        ✨
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{
          delay: 0.8,
          duration: 1.5,
          repeat: 2,
          ease: "easeInOut",
        }}
        className="absolute top-4 right-8 text-yellow-300"
      >
        ✨
      </motion.div>
    </motion.div>
  );
};

// Simple inline success indicator
export const InlineSuccessIcon = ({
  className,
  animated = true,
}: {
  className?: string;
  animated?: boolean;
}) => {
  return (
    <motion.div
      initial={animated ? { scale: 0, opacity: 0 } : {}}
      animate={animated ? { scale: 1, opacity: 1 } : {}}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 200,
      }}
      className={cn("inline-flex items-center", className)}
    >
      <TaskCompleteIcon size="sm" animated={animated} />
    </motion.div>
  );
};
