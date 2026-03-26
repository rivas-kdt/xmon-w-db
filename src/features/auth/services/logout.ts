"use server";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export async function logout() {
  const t = await getTranslations("logoutFunction");

  try {
    const cookieStore = await cookies();
    cookieStore.delete("authToken");
    cookieStore.delete("user");

    return { success: true, message: t("logoutSuccess") || "Logged out successfully" };
  } catch (error: any) {
    console.error("Error during logout:", error);
    throw new Error(error.message || t("fallbackError") || "Logout failed");
  }
}
