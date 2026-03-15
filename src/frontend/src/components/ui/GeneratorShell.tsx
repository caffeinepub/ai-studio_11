import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface GeneratorShellProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

export function GeneratorShell({
  title,
  description,
  icon,
  children,
  className,
}: GeneratorShellProps) {
  return (
    <div className={cn("min-h-full p-4 md:p-8", className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center glow-primary-sm">
            {icon}
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {children}
      </motion.div>
    </div>
  );
}
