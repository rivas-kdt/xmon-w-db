"use client";
import { useState } from "react";
import { filterTransactions } from "../services/filterTransactions";

interface Transaction {
  id: number;
  lot_no: string;
  stock_no: string;
  description: string;
  quantity: number;
  status: string;
  warehouse?: string;
  created_at: string;
}

interface FilterParams {
  startDate?: string;
  endDate?: string;
  type?: string;
  warehouseId?: string;
}

export function useTransactionFilter() {
  const [results, setResults] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filter = async (params: FilterParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await filterTransactions(params);
      setResults(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to filter transactions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, filter, clearFilter };
}
