"use client";
import { useState, useEffect } from "react";
import { getStockHistory } from "../services/getStockHistory";

interface StockHistoryEntry {
  id: number;
  lot_no: string;
  stock_no: string;
  description: string;
  quantity: number;
  warehouse?: string;
  created_at: string;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export function useStockHistory(dateRange?: DateRange) {
  const [history, setHistory] = useState<StockHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [dateRange]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStockHistory(dateRange);
      setHistory(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch stock history";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, fetchHistory, refetch: fetchHistory };
}
