"use client";
import { useState } from "react";
import { logout } from "../services/logout";

export function useLogout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await logout();
      // Clear local storage or any client-side auth state
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Redirect will be handled by component
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to logout";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { handleLogout, loading, error };
}
