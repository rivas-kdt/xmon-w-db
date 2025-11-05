"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "../hooks/sessionProvider";
import { useTheme } from "next-themes";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useSession();
  const router = useRouter();
  const { theme } = useTheme();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);
  console.log({ user, loading });

  if (loading)
    return (
      <div
        className={`flex items-center justify-center w-full h-screen bg-background transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0f1729]" : "bg-[#f8fafc]"
        }`}
      >
        <div className="loader">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`box box${i}`}>
              <div></div>
            </div>
          ))}
          <div className="ground">
            <div></div>
          </div>
        </div>
      </div>
    );

  if (!user) return null;

  return children;
}
