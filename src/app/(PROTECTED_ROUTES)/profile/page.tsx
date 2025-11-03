"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function Profile() {
  const { user, loading, logout } = useAuth();
  console.log(user);
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div> 
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-2xl font-bold">Profile Page</h1>
      <p className="mt-4">Welcome, {user?.username}!</p>
      <p className="mt-2">Email: {user?.email}</p>
      <p className="mt-2">Role: {user?.role}</p>
      <Button size={"default"} variant={"default"} onClick={logout}>Logout</Button>
    </div>
  );
}
