"use client";
import { useState, useCallback } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export function useNotification() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addNotification = useCallback(
    (message: string, type: "success" | "error" | "info" | "warning" = "info", duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message: string, duration?: number) => addNotification(message, "success", duration),
    [addNotification]
  );

  const error = useCallback(
    (message: string, duration?: number) => addNotification(message, "error", duration),
    [addNotification]
  );

  const info = useCallback(
    (message: string, duration?: number) => addNotification(message, "info", duration),
    [addNotification]
  );

  const warning = useCallback(
    (message: string, duration?: number) => addNotification(message, "warning", duration),
    [addNotification]
  );

  return { toasts, addNotification, removeNotification, success, error, info, warning };
}
