import { useState, useEffect } from "react";
import { getTotalInventory } from "../services/getInventory";

export function useInventoryHooks() {
  const [inventory, setInventory] = useState<number>(0);
  //   const [change, setChange] = useState<number | null>(null);
  const [inventoryLoading, setinventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setinventoryLoading(true);
    try {
      const response = await getTotalInventory();
      setInventory(response.total_stocked);
      console.log("Inventory response:", response);
      //   setChange(response.prev_months_total);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setInventoryError(error.message || "Failed to fetch inventory data");
    } finally {
      setinventoryLoading(false);
    }
  };

  return {
    inventory,
    // change,
    inventoryLoading,
    inventoryError,
    refetchInventory: fetchInventory,
  };
}
