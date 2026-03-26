"use client";
import { useState } from "react";
import { searchInventory } from "../services/searchInventory";

interface InventoryItem {
  lot_no: string;
  stock_no: string;
  description: string;
  quantity_on_hand: number;
  warehouse_id?: number;
}

export function useInventorySearch() {
  const [results, setResults] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (term: string) => {
    if (!term) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await searchInventory(term);
      setResults(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to search inventory";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setResults([]);
    setError(null);
  };

  return { results, loading, error, search, clearSearch };
}
