"use client";
import { useState, useEffect } from "react";
import { getRecipients } from "../services/getRecipients";

interface Recipient {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export function useRecipientManagement() {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipients();
  }, []);

  const fetchRecipients = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getRecipients();
      setRecipients(result);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch recipients";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    recipients,
    loading,
    error,
    fetchRecipients,
    refetch: fetchRecipients,
  };
}
