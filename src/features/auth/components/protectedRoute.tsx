"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../hooks/sessionProvider";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  if (!user) return null;

  return <>{children}</>;
}
