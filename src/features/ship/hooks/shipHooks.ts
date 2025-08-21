import { useEffect, useState } from "react";
import { shipParts } from "../services/shipParts";
import { getStockedParts } from "../services/getStockedParts";

export function useShipHooks() {
  const [message, setMessage] = useState<string | null>(null);
  const [stockedParts, setStockedParts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchStockedParts();
  }, []);

  const handleShipPart = async (lot_no: string, quantity: number) => {
    setLoading(true);
    try {
      const response = await shipParts(lot_no, quantity);
      setMessage(response.message);
      return response;
    } catch (error: any) {
      setError(error.message || "Failed to ship out the part");
    } finally {
      setLoading(false);
    }
  };

  const fetchStockedParts = async () => {
    setLoading(true);
    try {
      const warehouseId = localStorage.getItem("warehouseId");
      if (!warehouseId) {
        throw new Error("Warehouse ID not found in session storage");
      }
      const response = await getStockedParts(warehouseId);
      if (!response || response.length === 0) {
        throw new Error("No stocked parts found for the given warehouse");
      }
      setStockedParts(response);
    } catch (error: any) {
      setError(error.message || "Failed to fetch stocked parts");
    } finally {
      setLoading(false);
    }
  };

  return {
    message,
    error,
    loading,
    stockedParts,
    shipParts: handleShipPart,
  };
}
