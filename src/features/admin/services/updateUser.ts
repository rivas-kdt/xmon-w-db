"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface UpdateUserParams {
  username?: string;
  email?: string;
}

export async function updateUser(userId: string, updates: UpdateUserParams) {
  const t = await getTranslations("updateUserFunction");

  try {
    if (!userId) {
      throw new Error(t("userIdRequired") || "User ID is required");
    }

    const { username, email } = updates;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(t("emailInvalid") || "Invalid email address");
    }

    const client = await pool.connect();

    // Check if user exists
    const userCheck = await client.query("SELECT id FROM users WHERE uuid = $1", [userId]);
    if (userCheck.rows.length === 0) {
      client.release();
      throw new Error(t("userNotFound") || "User not found");
    }

    // Check if email is already taken (by another user)
    if (email) {
      const emailCheck = await client.query(
        "SELECT id FROM users WHERE email = $1 AND uuid != $2",
        [email, userId]
      );
      if (emailCheck.rows.length > 0) {
        client.release();
        throw new Error(t("emailAlreadyTaken") || "Email is already in use");
      }
    }

    const updateFields = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (username) {
      updateFields.push(`username = $${paramIndex}`);
      updateValues.push(username);
      paramIndex++;
    }

    if (email) {
      updateFields.push(`email = $${paramIndex}`);
      updateValues.push(email);
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(userId);

    const result = await client.query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE uuid = $${paramIndex} RETURNING *`,
      updateValues
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error updating user:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to update user");
  }
}
