"use server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jwt";
import { getTranslations } from "next-intl/server";

export async function verifySession() {
  const t = await getTranslations("verifySessionFunction");

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      throw new Error(t("noSessionToken") || "No session token found");
    }

    const decrypted = await decrypt(token);

    if (!decrypted) {
      throw new Error(t("invalidToken") || "Invalid or expired token");
    }

    return { valid: true, user: decrypted.user };
  } catch (error: any) {
    console.error("Error verifying session:", error);
    throw new Error(error.message || t("fallbackError") || "Session verification failed");
  }
}
