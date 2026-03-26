"use client";
import { useState, useCallback } from "react";

export function useError() {
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const setErrorMessage = useCallback((message: string) => {
    setError(message);
  }, []);

  const handleError = useCallback((err: Error | string) => {
    const message = typeof err === "string" ? err : err.message;
    setErrorMessage(message);
  }, [setErrorMessage]);

  return { error, setError: setErrorMessage, clearError, handleError };
}
