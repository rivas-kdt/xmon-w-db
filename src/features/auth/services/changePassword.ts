"use server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/jwt";
import { getTranslations } from "next-intl/server";

export async function changePassword(userId: string, oldPassword: string, newPassword: string) {
  const t = await getTranslations("changePasswordFunction");

  try {
    // Verify user is authenticated
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      throw new Error(t("unauthorized") || "Must be authenticated");
    }

    const decrypted = await decrypt(token);
    if (!decrypted || decrypted.user.userId !== userId) {
      throw new Error(t("unauthorized") || "Unauthorized access");
    }

    if (!oldPassword || !newPassword) {
      throw new Error(t("bothPasswordsRequired") || "Both old and new password required");
    }

    if (newPassword.length < 8) {
      throw new Error(t("passwordTooShort") || "Password must be at least 8 characters");
    }

    const client = await pool.connect();

    // Get current password hash
    const result = await client.query(
      "SELECT password_hash FROM users WHERE uuid = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      client.release();
      throw new Error(t("userNotFound") || "User not found");
    }

    // Verify old password
    const isValidPassword = await bcrypt.compare(oldPassword, result.rows[0].password_hash);
    if (!isValidPassword) {
      client.release();
      throw new Error(t("incorrectPassword") || "Incorrect current password");
    }

    // Hash new password and update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await client.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE uuid = $2",
      [hashedPassword, userId]
    );

    client.release();

    return { success: true, message: t("passwordChanged") || "Password changed successfully" };
  } catch (error: any) {
    console.error("Error changing password:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to change password");
  }
}
