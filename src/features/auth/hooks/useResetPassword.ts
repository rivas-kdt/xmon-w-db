"use client";
import { useState } from "react";
import { resetPassword } from "../services/resetPassword";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await resetPassword(token, newPassword);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to reset password";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleResetPassword, loading, error, success };
}
