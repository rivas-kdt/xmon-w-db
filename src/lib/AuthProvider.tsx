import { useAuth } from "@/features/auth/hooks/useAuth";
import React from "react";

const AuthContext = React.createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, error, loading, logout } = useAuth();

  return (
    <AuthContext.Provider value={{ user, error, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
