"use client";
import { useState, useEffect } from "react";
import { getWarehouse } from "../services/getWarehouse";

interface Warehouse {
  id: string;
  warehouse: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export function useWarehouseManagement() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getWarehouse();
      setWarehouses(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch warehouses";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    warehouses,
    loading,
    error,
    fetchWarehouses,
    refetch: fetchWarehouses,
  };
}
