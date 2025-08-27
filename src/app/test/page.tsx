"use client"
import { useRecipientHooks } from "@/features/admin/hooks/useRecipientsHooks";
import { useUserHooks } from "@/features/admin/hooks/useUsersHooks";
import { useWarehouseHooks } from "@/features/admin/hooks/useWarehousesHooks";
import DashboardDesktop from "@/features/landing/components/landingDesktop";
import { useStockActions } from "@/features/stock/hooks/useStockHooks";

export default function Landing() {
  const { users } = useUserHooks();
  const { warehouse } = useWarehouseHooks()
  const { recipients } = useRecipientHooks()

  console.log("Warehouse:", warehouse);
  console.log("Recipients:", recipients);
  console.log("Users:", users);

  return <DashboardDesktop/>
}
