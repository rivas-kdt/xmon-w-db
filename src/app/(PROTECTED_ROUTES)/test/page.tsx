"use client";
import { useRecipientHooks } from "@/features/admin/hooks/useRecipientsHooks";
import { useUserHooks } from "@/features/admin/hooks/useUsersHooks";
import { useWarehouseHooks } from "@/features/admin/hooks/useWarehousesHooks";
import DashboardDesktop from "@/features/landing/components/landingDesktop";
<<<<<<< HEAD
import { useStockActions } from "@/features/stock/hooks/useStockHooks";
=======
import DashboardMobile from "@/features/landing/components/landingMobile";
import { useIsMobile } from "@/hooks/useMobile";
>>>>>>> 7398aed8c470c1a19898a05493c16c9f64989d1b

export default function Landing() {
  const isMobile = useIsMobile();
  const { users } = useUserHooks();
  const { warehouse } = useWarehouseHooks();
  const { recipients } = useRecipientHooks();

  console.log("Warehouse:", warehouse);
  console.log("Recipients:", recipients);
  console.log("Users:", users);

  return <>{isMobile ? <DashboardMobile /> : <DashboardDesktop />}</>;
}
