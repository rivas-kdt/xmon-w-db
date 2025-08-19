"use client";
import { Button } from "@/components/ui/button";
// import { useUserHooks } from "@/features/admin/hooks/useUsersHooks";
import { useWarehouseHooks } from "@/features/admin/hooks/useWarehousesHooks";

export default function Home() {
  // const { addUser, addUserError } = useUserHooks();
  const { addWarehouse, addWarehouseError } = useWarehouseHooks();
  console.log(addWarehouseError);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button
        className=" bg-amber-500"
        size={"sm"}
        variant={"default"}
        onClick={() => addWarehouse("12312", "email1@gmail.com")}
      >
        Add Warehouse
      </Button>
      {addWarehouseError && (
        <div className="text-red-500">{addWarehouseError}</div>
      )}
    </div>
  );
}