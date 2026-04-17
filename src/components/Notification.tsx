"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, X, AlertCircle } from "lucide-react";
import { NotificationType, useNotification } from "@/context/NotificationContext";

interface NotificationProps {
  id: string;
  message: string;
  type: NotificationType;
}

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-rose-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

const borderColors = {
  success: "border-emerald-500/20",
  error: "border-rose-500/20",
  warning: "border-amber-500/20",
  info: "border-blue-500/20",
};

const glowColors = {
  success: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
  error: "shadow-[0_0_20px_rgba(244,63,94,0.1)]",
  warning: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
  info: "shadow-[0_0_20px_rgba(59,130,246,0.1)]",
};

export const Notification = ({ id, message, type }: NotificationProps) => {
  const { removeNotification } = useNotification();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`
        relative overflow-hidden
        flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4 
        w-full sm:min-w-[380px] sm:max-w-[500px]
        bg-zinc-900/95 backdrop-blur-xl
        border ${borderColors[type]}
        ${glowColors[type]}
        rounded-2xl shadow-2xl
        group
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {icons[type]}
      </div>

      {/* Message */}
      <div className="flex-grow">
        <p className="text-sm font-medium text-zinc-100 leading-snug">
          {message}
        </p>
      </div>

      {/* Close Button */}
      <button
        onClick={() => removeNotification(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar (Visual only, matches 5s timeout) */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: "linear" }}
        className={`
          absolute bottom-0 left-0 right-0 h-[2px] origin-left
          ${type === 'success' ? 'bg-emerald-500/40' : 
            type === 'error' ? 'bg-rose-500/40' : 
            type === 'warning' ? 'bg-amber-500/40' : 'bg-blue-500/40'}
        `}
      />
    </motion.div>
  );
};

export const NotificationContainer = () => {
  const { notifications } = useNotification();

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-center gap-3 w-full max-w-[500px] px-4 sm:px-6">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => (
            <Notification key={n.id} {...n} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
