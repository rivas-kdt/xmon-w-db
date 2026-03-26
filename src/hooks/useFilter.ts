"use client";
import { useState, useCallback } from "react";

export function useFilter<T extends Record<string, any>>(initialFilters: T) {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback(
    (key: keyof T, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateFilters = useCallback((newFilters: Partial<T>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilter = useCallback(
    (key: keyof T) => {
      setFilters((prev) => ({ ...prev, [key]: initialFilters[key] }));
    },
    [initialFilters]
  );

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  return { filters, updateFilter, updateFilters, clearFilter, clearAllFilters };
}
