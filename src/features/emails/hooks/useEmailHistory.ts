"use client";
import { useState, useEffect } from "react";
import { getEmailHistory } from "../services/getEmailHistory";

interface EmailHistoryEntry {
  id: number;
  recipient_email: string;
  subject: string;
  status: string;
  created_at: string;
}

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export function useEmailHistory(dateRange?: DateRange) {
  const [history, setHistory] = useState<EmailHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, [dateRange]);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getEmailHistory(dateRange);
      setHistory(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch email history";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { history, loading, error, fetchHistory, refetch: fetchHistory };
}
