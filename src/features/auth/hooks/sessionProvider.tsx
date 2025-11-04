"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface SessionContextType {
  user: any;
  loading: boolean;
  error: string | null;
  login: (args: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const { user, loading, error, login, logout } = useAuth(false);

  return (
    <SessionContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
