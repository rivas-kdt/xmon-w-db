"use client";
import { useState } from "react";
import { forgotPassword } from "../services/forgotPassword";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await forgotPassword(email);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to process request";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError(null);
    setSuccess(false);
  };

  return { requestPasswordReset, loading, error, success, resetState };
}
