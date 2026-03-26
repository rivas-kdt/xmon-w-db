"use client";
import { useState } from "react";
import { deleteUser } from "../services/deleteUser";

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const result = await deleteUser(userId);
      setSuccess(true);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to delete user";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleDeleteUser, loading, error, success };
}
