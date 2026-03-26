"use client";
import { useState, useEffect } from "react";
import { getStockByWarehouse } from "../services/getStockByWarehouse";

interface InventoryItem {
  lot_no: string;
  stock_no: string;
  description: string;
  quantity_on_hand: number;
  warehouse: string;
}

export function useStockByWarehouse(warehouseId?: string) {
  const [stock, setStock] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (warehouseId) {
      fetchStock();
    }
  }, [warehouseId]);

  const fetchStock = async () => {
    if (!warehouseId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await getStockByWarehouse(warehouseId);
      setStock(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch warehouse stock";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { stock, loading, error, fetchStock, refetch: fetchStock };
}
