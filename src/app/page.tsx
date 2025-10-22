"use client";

import DashboardDesktop from "@/features/landing/components/landingDesktop";
import DashboardMobile from "@/features/landing/components/landingMobile";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useIsMobile();
  // const { addUser, addUserError } = useUserHooks();
  // const { addWarehouse, addWarehouseError } = useWarehouseHooks();
  if (typeof window !== "undefined") {
    // Access sessionStorage here
    sessionStorage.setItem(
      "warehouseId",
      "6939e940-7c6f-48b3-8393-964623175c24"
    );
  }
  // console.log(addWarehouseError);'

  return (
    <>{isMobile ? <DashboardMobile /> : <DashboardDesktop />}</>
    // <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    /* <Button
        className=" bg-amber-500"
        size={"sm"}
        variant={"default"}
        onClick={() => shipParts("01578560005430", 400)}
      >
        Add Warehouse
      </Button> */
    // </div>
  );
}
