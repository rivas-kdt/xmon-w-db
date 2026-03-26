"use client";
import { useState } from "react";
import { searchUsers } from "../services/searchUsers";

interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  role: string;
  warehouse?: string;
}

export function useUserSearch() {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (term: string) => {
    if (!term) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await searchUsers(term);
      setResults(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to search users";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clearSearch };
}
