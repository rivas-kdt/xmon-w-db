import { decrypt, deleteSession, get } from "@/lib/cookieHandler";
import { create } from "@/lib/cookieHandler";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  userId: string;
  username: string;
  role: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await get("jwt");
        if (!res) {
          console.log("No JWT token found");
          router.push("/login");
          return;
        }
        const sesh = await decrypt(res);
        if (!sesh) {
          console.log("Failed to decrypt session");
          router.push("/login");
        } else {
          setUser(sesh.user as User);
        }
      } catch (error) {
        console.error("Error getting or decrypting token:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    getToken();
  }, []);

  const handleLogin = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
        return
      }
      console.log("Login response:", data);
      await create(data.token);
      console.log("Login successful, token:", data.token);
      router.push("/");
    } catch (error) {
      setError("Something went wrong. Please try again.peke");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await deleteSession();
    } catch (error) {
      console.error("Error deleting session:", error);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

  return { loading, user, login: handleLogin, logout, error };
}
