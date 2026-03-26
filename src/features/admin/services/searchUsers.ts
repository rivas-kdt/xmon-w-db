"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function searchUsers(searchTerm: string) {
  const t = await getTranslations("searchUsersFunction");

  try {
    if (!searchTerm || searchTerm.length < 2) {
      throw new Error(t("searchTermTooShort") || "Search term must be at least 2 characters");
    }

    const client = await pool.connect();

    const result = await client.query(
      `SELECT u.id, u.uuid, u.username, u.email, u.role, u.created_at, w.warehouse
       FROM users u
       LEFT JOIN worker_location wl ON u.id = wl.user_id
       LEFT JOIN warehouse w ON wl.warehouse_id = w.id
       WHERE u.username ILIKE $1 OR u.email ILIKE $1
       ORDER BY u.username ASC`,
      [`%${searchTerm}%`]
    );

    client.release();

    return result.rows;
  } catch (error: any) {
    console.error("Error searching users:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to search users");
  }
}
