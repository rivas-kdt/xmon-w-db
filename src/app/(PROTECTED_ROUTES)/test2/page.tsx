"use client";
import { useRecipientHooks } from "@/features/admin/hooks/useRecipientsHooks";
import { useUserHooks } from "@/features/admin/hooks/useUsersHooks";
import { useWarehouseHooks } from "@/features/admin/hooks/useWarehousesHooks";
import DashboardDesktop from "@/features/landing/components/landingDesktop";
import DashboardMobile from "@/features/landing/components/landingMobile";
import { useIsMobile } from "@/hooks/useMobile";

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
