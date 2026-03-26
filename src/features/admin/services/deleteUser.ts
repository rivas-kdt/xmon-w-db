"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function deleteUser(userId: string) {
  const t = await getTranslations("deleteUserFunction");

  try {
    if (!userId) {
      throw new Error(t("userIdRequired") || "User ID is required");
    }

    const client = await pool.connect();

    // Check if user exists
    const userCheck = await client.query(
      "SELECT id, username FROM users WHERE id = $1",
      [userId]
    );
    if (userCheck.rows.length === 0) {
      client.release();
      throw new Error(t("userNotFound") || "User not found");
    }

    // Delete worker location association
    await client.query("DELETE FROM worker_location WHERE user_id = $1", [
      userCheck.rows[0].id,
    ]);

    // Delete user
    await client.query("DELETE FROM users WHERE id = $1", [userId]);

    client.release();

    return {
      success: true,
      message: t("userDeleted") || `User ${userCheck.rows[0].username} deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to delete user");
  }
}
