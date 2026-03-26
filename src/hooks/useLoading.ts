"use client";
import { useState, useCallback } from "react";

export function useLoading(initialState: boolean = false) {
  const [loading, setLoading] = useState(initialState);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await fn();
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, setLoading, withLoading };
}
