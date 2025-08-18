import { useState, useEffect } from "react";
import { getMonthlyTransaction } from "../services/getMonthlyInventory";
import { getRecentShipped } from "../services/getRecentShipped";
import { getRecentStocked } from "../services/getRecentStocked";

export function useTransactions() {
  const [monthly, setMonthly] = useState<any>(null);
  const [recentShipped, setRecentShipped] = useState<any[]>([]);
  const [recentStocked, setRecentStocked] = useState<any[]>([]);
  const [recentShippedError, setRecentShippedError] = useState<string | null>(
    null
  );
  const [recentStockedError, setRecentStockedError] = useState<string | null>(
    null
  );
  const [transactionLoading, setLoading] = useState(true);
  const [monthlyError, setMonthlyError] = useState<string | null>(null);

  useEffect(() => {
    fetchMonthlyInventory();
    fetchRecentStocked();
    fetchRecentShipped();
  }, []);

  const fetchMonthlyInventory = async () => {
    setLoading(true);
    try {
      const response = await getMonthlyTransaction();
      setMonthly(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setMonthlyError(error.message || "Failed to fetch overview data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentShipped = async () => {
    setLoading(true);
    try {
      const response = await getRecentShipped();
      setRecentShipped(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setRecentShippedError(error.message || "Failed to fetch overview data");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentStocked = async () => {
    setLoading(true);
    try {
      const response = await getRecentStocked();
      setRecentStocked(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setRecentStockedError(error.message || "Failed to fetch overview data");
    } finally {
      setLoading(false);
    }
  };

  return {
    transactionLoading,
    monthly,
    monthlyError,
    recentShipped,
    recentShippedError,
    recentStocked,
    recentStockedError,
    refetchMonthlyInventory: fetchMonthlyInventory,
    refetchRecentShipped: fetchRecentShipped,
    refetchRecentStocked: fetchRecentStocked,
  };
}
