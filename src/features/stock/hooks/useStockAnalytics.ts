"use client";
import { useState, useEffect } from "react";
import { getStockAnalytics } from "../services/getStockAnalytics";

interface StockAnalytics {
  totalEntries: number;
  addedToday: number;
  removedToday: number;
  netQuantityToday: number;
  topWarehouses: any[];
}

export function useStockAnalytics() {
  const [analytics, setAnalytics] = useState<StockAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStockAnalytics();
      setAnalytics(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch analytics";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, error, fetchAnalytics, refetch: fetchAnalytics };
}
