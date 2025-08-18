import { useState, useEffect } from "react";
import { getWarehouse, getWarehouseWorkers } from "../services/warehouseService";

export function useWarehouseHooks() {
  const [warehouseWorker, setWarehouseWorker] = useState<any[]>([]);
  const [warehouse, setWarehouse] = useState<any[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(true);
  const [warehouseError, setWarehouseError] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouseWorkers();
    fetchWarehouse();
  }, []);

  const fetchWarehouseWorkers = async () => {
    setWarehouseLoading(true);
    try {
      const response = await getWarehouseWorkers();
      setWarehouseWorker(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setWarehouseError(error.message || "Failed to fetch stocked data");
    } finally {
      setWarehouseLoading(false);
    }
  };

  const fetchWarehouse = async () => {
    setWarehouseLoading(true);
    try {
      const response = await getWarehouse();
      setWarehouse(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setWarehouseError(error.message || "Failed to fetch stocked data");
    } finally {
      setWarehouseLoading(false);
    }
  };

  return {
    warehouse,
    warehouseWorker,
    warehouseLoading,
    warehouseError,
    refetchwarehouse: fetchWarehouseWorkers,
  };
}
