"use client";
import { useState, useEffect } from "react";
import { getShippingHistory } from "../services/getShippingHistory";

interface ShippingHistoryEntry {
  id: number;
  lot_no: string;
  stock_no: string;
  description: string;
  quantity: number;
  status: string;
  warehouse?: string;
  recipient_name?: string;
  created_at: string;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export function useShippingHistory(dateRange?: DateRange) {
  const [history, setHistory] = useState<ShippingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [dateRange]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getShippingHistory(dateRange);
      setHistory(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch shipping history";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, fetchHistory, refetch: fetchHistory };
}
