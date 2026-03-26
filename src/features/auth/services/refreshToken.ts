"use server";
import pool from "@/lib/db";
import { encrypt, decrypt } from "@/lib/jwt";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

export async function refreshToken() {
  const t = await getTranslations("refreshTokenFunction");

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      throw new Error(t("noToken") || "No authentication token found");
    }

    // Attempt to decrypt current token
    const decrypted = await decrypt(token);

    if (!decrypted || !decrypted.user) {
      throw new Error(t("invalidToken") || "Invalid authentication token");
    }

    const client = await pool.connect();

    // Verify user still exists in database
    const userResult = await client.query(
      "SELECT * FROM users u LEFT JOIN worker_location wl ON u.id = wl.user_id LEFT JOIN warehouse w ON wl.warehouse_id=w.id WHERE u.uuid = $1",
      [decrypted.user.userId]
    );

    client.release();

    if (userResult.rows.length === 0) {
      throw new Error(t("userNotFound") || "User not found");
    }

    // Generate new token
    const newToken = await encrypt({ user: decrypted.user });

    if (!newToken) {
      throw new Error(t("failedToGenerateToken") || "Failed to generate new token");
    }

    // Update cookie
    cookieStore.set("authToken", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return { success: true, token: newToken, user: decrypted.user };
  } catch (error: any) {
    console.error("Error refreshing token:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to refresh token");
  }
}
