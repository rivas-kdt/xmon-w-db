"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface PaginationParams {
  page: number;
  limit: number;
}

export async function getAllUsers(params?: PaginationParams) {
  const t = await getTranslations("getAllUsersFunction");
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const offset = (page - 1) * limit;

  try {
    const client = await pool.connect();

    // Get total count
    const countResult = await client.query("SELECT COUNT(*) as total FROM users");
    const total = parseInt(countResult.rows[0].total);

    // Get paginated users
    const result = await client.query(
      `SELECT u.id, u.uuid, u.username, u.email, u.role, u.created_at, u.updated_at, w.warehouse
       FROM users u
       LEFT JOIN worker_location wl ON u.id = wl.user_id
       LEFT JOIN warehouse w ON wl.warehouse_id = w.id
       ORDER BY u.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    client.release();

    return {
      users: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch users");
  }
}
