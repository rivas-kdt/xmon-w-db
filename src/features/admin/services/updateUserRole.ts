"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function updateUserRole(userId: string, newRole: string) {
  const t = await getTranslations("updateUserRoleFunction");

  try {
    if (!userId || !newRole) {
      throw new Error(t("userIdAndRoleRequired") || "User ID and role are required");
    }

    const validRoles = ["admin", "manager", "user", "viewer"];
    if (!validRoles.includes(newRole.toLowerCase())) {
      throw new Error(t("invalidRole") || "Invalid role");
    }

    const client = await pool.connect();

    // Check if user exists
    const userCheck = await client.query("SELECT id FROM users WHERE uuid = $1", [userId]);
    if (userCheck.rows.length === 0) {
      client.release();
      throw new Error(t("userNotFound") || "User not found");
    }

    const result = await client.query(
      "UPDATE users SET role = $1, updated_at = NOW() WHERE uuid = $2 RETURNING *",
      [newRole.toLowerCase(), userId]
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error updating user role:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to update user role");
  }
}
