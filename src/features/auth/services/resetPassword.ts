"use server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getTranslations } from "next-intl/server";

export async function resetPassword(token: string, newPassword: string) {
  const t = await getTranslations("resetPasswordFunction");

  try {
    if (!token || !newPassword) {
      throw new Error(t("tokenAndPasswordRequired") || "Token and password required");
    }

    if (newPassword.length < 8) {
      throw new Error(t("passwordTooShort") || "Password must be at least 8 characters");
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const client = await pool.connect();

    // Verify token exists and is not expired
    const tokenResult = await client.query(
      "SELECT user_id FROM password_reset_tokens WHERE token_hash = $1 AND expires_at > NOW()",
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      client.release();
      throw new Error(t("invalidOrExpiredToken") || "Invalid or expired reset token");
    }

    const userId = tokenResult.rows[0].user_id;

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await client.query(
      "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE uuid = $2",
      [hashedPassword, userId]
    );

    // Delete used token
    await client.query(
      "DELETE FROM password_reset_tokens WHERE user_id = $1",
      [userId]
    );

    client.release();

    return { success: true, message: t("passwordReset") || "Password reset successfully" };
  } catch (error: any) {
    console.error("Error resetting password:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to reset password");
  }
}
