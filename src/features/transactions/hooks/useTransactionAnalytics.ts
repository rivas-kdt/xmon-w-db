"use client";
import { useState, useEffect } from "react";
import { getTransactionAnalytics } from "../services/getTransactionAnalytics";

interface TransactionAnalytics {
  totalTransactions: number;
  transactionsToday: number;
  transactionsMonth: number;
  avgQuantity: number;
  byStatus: any[];
  topWarehouses: any[];
}

export function useTransactionAnalytics() {
  const [analytics, setAnalytics] = useState<TransactionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactionAnalytics();
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
