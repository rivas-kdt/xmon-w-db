"use client";
import { useState } from "react";
import { deleteStockEntry } from "../services/deleteStockEntry";

export function useStockDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const deleteEntry = async (historyId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await deleteStockEntry(historyId);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete stock entry";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteEntry, loading, error, success };
}
