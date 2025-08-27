"use client";

import { Button } from "@/components/ui/button";
import { useStockActions } from "@/features/stock/hooks/useStockHooks";

export default function Home() {
  // const { addUser, addUserError } = useUserHooks();
  // const { addWarehouse, addWarehouseError } = useWarehouseHooks();
  if (typeof window !== "undefined") {
    // Access sessionStorage here
    sessionStorage.setItem(
      "warehouseId",
      "6939e940-7c6f-48b3-8393-964623175c24"
    );
  }

  const { handleStockItems } = useStockActions();
  // console.log(addWarehouseError);'

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button
        className=" bg-amber-500"
        size={"sm"}
        variant={"default"}
        onClick={() => handleStockItems("01578560005430", "31379-05430", "CS", "Circular Saw RCS", 25)}
      >
        Add Warehouse
      </Button>
    </div>
  );
}
