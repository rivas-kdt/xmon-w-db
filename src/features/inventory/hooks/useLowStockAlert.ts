"use client";
import { useState } from "react";
import { getLowStockItems } from "../services/getLowStockItems";

interface LowStockItem {
  lot_no: string;
  stock_no: string;
  description: string;
  quantity_on_hand: number;
  warehouse?: string;
}

export function useLowStockAlert(threshold: number = 10) {
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLowStockItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getLowStockItems(threshold);
      setLowStockItems(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch low stock items";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    lowStockItems,
    loading,
    error,
    fetchLowStockItems,
    itemCount: lowStockItems.length,
  };
}
