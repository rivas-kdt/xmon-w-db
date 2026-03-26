"use client";
import { useState } from "react";
import { updateUserRole } from "../services/updateUserRole";

export function useRoleManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changeRole = async (userId: string, newRole: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await updateUserRole(userId, newRole);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to change role";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { changeRole, loading, error, success };
}
