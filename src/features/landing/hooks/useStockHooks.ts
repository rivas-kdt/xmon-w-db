import { useState, useEffect } from "react";
import { getShip } from "../services/getShip";

export function useStockHooks() {
  const [stockedThisMonth, setThisMonth] = useState<number | null>(null);
  const [stockedLastMonth, setLastMonth] = useState<number | null>(null);
  const [stockedPercentageChange, setPercentageChange] = useState<number | null>(
    null
  );
  const [stockedLoading, setLoading] = useState(true);
  const [stockedError, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStocked();
  }, []);

  const fetchStocked = async () => {
    setLoading(true);
    try {
      const response = await getShip();
      setThisMonth(response.this_months_total);
      setLastMonth(response.prev_months_total);
      setPercentageChange(response.percentage_change);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setError(error.message || "Failed to fetch stocked data");
    } finally {
      setLoading(false);
    }
  };

  return { stockedThisMonth, stockedLastMonth, stockedPercentageChange, stockedLoading, stockedError, refetchStocked: fetchStocked};
}
