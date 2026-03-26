"use client";
import { useState, useEffect } from "react";
import { getAllUsers } from "../services/getAllUsers";

interface User {
  id: number;
  uuid: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  warehouse?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function useUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getAllUsers({ page, limit });
      setUsers(result.users);
      setPagination(result.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    pagination,
    loading,
    error,
    fetchUsers,
    refetch: () => fetchUsers(pagination?.page || 1),
  };
}
