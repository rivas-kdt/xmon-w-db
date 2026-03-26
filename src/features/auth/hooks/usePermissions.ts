"use client";
import { useState, useEffect } from "react";

interface UserPermissions {
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  [key: string]: boolean;
}

const rolePermissions: { [key: string]: UserPermissions } = {
  admin: {
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
  },
  manager: {
    canRead: true,
    canCreate: true,
    canUpdate: true,
    canDelete: false,
  },
  user: {
    canRead: true,
    canCreate: true,
    canUpdate: false,
    canDelete: false,
  },
  viewer: {
    canRead: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
  },
};

export function usePermissions(userRole?: string) {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPermissions = async () => {
      try {
        let role = userRole;

        if (!role) {
          // Try to get role from localStorage (set by client after login)
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const user = JSON.parse(storedUser);
            role = user.role || "viewer";
          } else {
            role = "viewer";
          }
        }

        const roleKey = role?.toLowerCase() || "viewer";
        const userPerms = rolePermissions[roleKey] || rolePermissions.viewer;
        setPermissions(userPerms);
      } catch {
        // Error getting permissions from localStorage
        setPermissions(rolePermissions.viewer);
      } finally {
        setLoading(false);
      }
    };

    getPermissions();
  }, [userRole]);

  const hasPermission = (permission: string): boolean => {
    return permissions?.[permission] ?? false;
  };

  return { permissions, loading, hasPermission };
}
