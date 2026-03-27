"use client";
import { useState, useEffect, useCallback } from "react";
import { getEmailHistory } from "../services/getEmailHistory";

export function useEmailHistory(
  initialPage = 1,
  initialLimit = 10,
  initialSearch = ""
) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState(initialSearch);

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await getEmailHistory({
        page,
        limit,
        search,
      });

      setHistory(result.rows || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 1);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch email history";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    loading,
    error,
    fetchHistory,
    refetch: fetchHistory,

    page,
    setPage,
    limit,
    setLimit,
    search,
    setSearch,

    total,
    totalPages,
  };
}
