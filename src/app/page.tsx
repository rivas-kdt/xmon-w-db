"use client"
import { Button } from "@/components/ui/button";

export default function Home() {
  const handleAddUser = async () => {
    const response = await fetch("/api/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin",
      }),
    })
    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData.error);
      return;
    }
    const data = await response.json();
    console.log("User added successfully:", data);
    alert("User added successfully");
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button className=" bg-amber-500" size={'sm'} variant={'default'} onClick={handleAddUser}>Add User</Button>
    </div>
  );
}
