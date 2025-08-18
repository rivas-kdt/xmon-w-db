import { useState, useEffect, use } from "react";
import { getWarehouseInvnentory } from "../services/getWarehouseInventory";

export function useWarehouseHooks() {
  const [warehouseInventory, setWarehouseInventory] = useState<any[]>([]);
  const [warehouseLoading, setLoading] = useState(true);
  const [warehouseError, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouseInventory();
  }, []);

  const fetchWarehouseInventory = async () => {
    setLoading(true);
    try {
      const response = await getWarehouseInvnentory();
      setWarehouseInventory(response);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setError(error.message || "Failed to fetch shipped data");
    } finally {
      setLoading(false);
    }
  };

  return {warehouseInventory, warehouseLoading, warehouseError, refetchWarehouseInventory: fetchWarehouseInventory};
}
