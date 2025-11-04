"use client";

import { useSession } from "@/features/auth/hooks/sessionProvider";
import DashboardDesktop from "@/features/landing/components/landingDesktop";
import LandingMobile from "@/features/landing/components/landingMobile";
import { useIsMobile } from "@/hooks/useMobile";

export default function Home() {
  const isMobile = useIsMobile();

  const { loading } = useSession();

  if (loading) return <p>Loading...</p>;

  return <>{isMobile ? <LandingMobile /> : <DashboardDesktop />}</>;
}
