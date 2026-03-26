"use client";
import { useState, useEffect } from "react";
import { verifySession } from "../services/verifySession";

export function useSessionTimeout(timeoutMinutes: number = 30) {
  const [isSessionValid, setIsSessionValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const result = await verifySession();
        setIsSessionValid(result.valid);
      } catch (err: any) {
        setIsSessionValid(false);
        setError(err.message || "Failed to verify session");
      } finally {
        setLoading(false);
      }
    };

    // Check session on mount
    checkSession();

    // Set up interval to periodically check session
    const intervalId = setInterval(checkSession, timeoutMinutes * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [timeoutMinutes]);

  return { isSessionValid, loading, error };
}
