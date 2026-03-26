"use client";
import { useState, useCallback } from "react";

export function useSearch<T extends Record<string, any>>(
  items: T[],
  searchableFields: (keyof T)[]
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState(items);

  const search = useCallback(
    (term: string) => {
      setSearchTerm(term);

      if (!term.trim()) {
        setResults(items);
        return;
      }

      const lowerTerm = term.toLowerCase();
      const filtered = items.filter((item) =>
        searchableFields.some((field) => {
          const value = item[field];
          return (
            value &&
            String(value).toLowerCase().includes(lowerTerm)
          );
        })
      );

      setResults(filtered);
    },
    [items, searchableFields]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setResults(items);
  }, [items]);

  return { searchTerm, results, search, clearSearch };
}
