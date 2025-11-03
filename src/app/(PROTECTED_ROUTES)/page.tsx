"use client";

import DashboardDesktop from "@/features/landing/components/landingDesktop";
import DashboardMobile from "@/features/landing/components/landingMobile";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useIsMobile();
  console.log("Rendering Landing Page");

  return <>{isMobile ? <DashboardMobile /> : <DashboardDesktop />}</>;
}
