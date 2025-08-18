import { useState, useEffect, use } from "react";
import { getStock } from "../services/getStock";

export function useShipHooks() {
  const [shippedThisMonth, setThisMonth] = useState<number | null>(null);
  const [shippedLastMonth, setLastMonth] = useState<number | null>(null);
  const [shippedPercentageChange, setPercentageChange] = useState<number | null>(
    null
  );
  const [shippedLoading, setLoading] = useState(true);
  const [shippedError, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShipped();
  }, []);

  const fetchShipped = async () => {
    setLoading(true);
    try {
      const response = await getStock();
      setThisMonth(response.this_months_total);
      setLastMonth(response.prev_months_total);
      setPercentageChange(response.percentage_change);
    } catch (error: any) {
      console.error("Error fetching metrics:", error);
      setError(error.message || "Failed to fetch shipped data");
    } finally {
      setLoading(false);
    }
  };

  return { shippedThisMonth, shippedLastMonth, shippedPercentageChange, shippedLoading, shippedError, refetchShipped: fetchShipped};
}
