"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function deactivateUser(userId: string) {
  const t = await getTranslations("deactivateUserFunction");

  try {
    if (!userId) {
      throw new Error(t("userIdRequired") || "User ID is required");
    }

    const client = await pool.connect();

    // Check if user exists
    const userCheck = await client.query(
      "SELECT id, is_active FROM users WHERE uuid = $1",
      [userId]
    );
    if (userCheck.rows.length === 0) {
      client.release();
      throw new Error(t("userNotFound") || "User not found");
    }

    const result = await client.query(
      "UPDATE users SET is_active = false, updated_at = NOW() WHERE uuid = $1 RETURNING *",
      [userId]
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error deactivating user:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to deactivate user");
  }
}
