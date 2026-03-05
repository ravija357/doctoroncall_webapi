"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SocialButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
}

export const SocialButton = ({ onClick, icon, label, className, disabled }: SocialButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex items-center justify-center gap-3 w-full h-12 px-6 rounded-full",
        "bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700",
        "text-slate-700 dark:text-slate-200 font-medium transition-all duration-200",
        "shadow-sm hover:shadow-md hover:border-primary/30",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
        {icon}
      </span>
      <span className="truncate text-sm">{label}</span>
    </motion.button>
  );
};
