"use server";

import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

type EditUserPayload = {
  userId: string;
  username?: string;
  email?: string;
  role?: string;
  location?: string;
};

export async function editUser(payload: EditUserPayload) {
  const t = await getTranslations("editUser");
  const { userId, username, email, role, location } = payload;

  // Build dynamic SET clause safely
  const set: string[] = [];
  const values: any[] = [];

  if (username !== undefined) {
    values.push(username);
    set.push(`username = $${values.length}`);
  }

  if (email !== undefined) {
    values.push(email);
    set.push(`email = $${values.length}`);
  }

  if (role !== undefined) {
    values.push(role);
    set.push(`role = $${values.length}`);
  }

  if (set.length === 0 && location === undefined) {
    return { success: true, message: t("noChanges") ?? "No changes detected." };
  }

  const client = await pool.connect();
  try {
    values.push(userId);
    if (set.length > 0) {
      await client.query(
        `UPDATE users SET ${set.join(", ")} WHERE id = $${values.length}`,
        values
      );
    }

    const worker_location = await client.query(
      `SELECT * FROM worker_location WHERE user_id = $1`,
      [userId]
    );
    if (worker_location.rows.length === 0 && location !== undefined) {
      await client.query(
        `INSERT INTO worker_location (user_id, warehouse_id) VALUES ($1, $2)`,
        [userId, location]
      );
    } else if (worker_location.rows.length === 1 && location !== undefined) {
      await client.query(
        `UPDATE worker_location SET warehouse_id = $1 WHERE user_id = $2`,
        [location, userId]
      );
    }
    return { success: true, message: "User Updated Successfully" };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return {
      success: false,
      error: error?.message || t("fallbackError"),
    };
  } finally {
    client.release();
  }
}
