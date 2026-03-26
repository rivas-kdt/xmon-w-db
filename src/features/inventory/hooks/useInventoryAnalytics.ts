"use client";
import { useState } from "react";
import { getInventoryAnalytics } from "../services/getInventoryAnalytics";

interface InventoryAnalytics {
  totalItems: number;
  lowStockItems: number;
  totalQuantity: number;
  averageStock: number;
  byWarehouse: any[];
}

export function useInventoryAnalytics() {
  const [analytics, setAnalytics] = useState<InventoryAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getInventoryAnalytics();
      setAnalytics(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch analytics";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { analytics, loading, error, fetchAnalytics };
}
