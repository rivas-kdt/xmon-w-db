"use client";
import { useState } from "react";
import { changePassword } from "../services/changePassword";

export function useChangePassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChangePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await changePassword(userId, oldPassword, newPassword);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to change password";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleChangePassword, loading, error, success };
}
