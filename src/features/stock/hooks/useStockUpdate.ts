"use client";
import { useState } from "react";
import { updateStockEntry } from "../services/updateStockEntry";

interface UpdateParams {
  quantity?: number;
  notes?: string;
}

export function useStockUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateEntry = async (historyId: string, updates: UpdateParams) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await updateStockEntry(historyId, updates);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update stock entry";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateEntry, loading, error, success };
}
