"use server";
import pool from "@/lib/db";
import crypto from "crypto";
import { getTranslations } from "next-intl/server";

export async function forgotPassword(email: string) {
  const t = await getTranslations("forgotPasswordFunction");

  try {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(t("invalidEmail") || "Invalid email address");
    }

    const client = await pool.connect();

    // Check if user exists
    const result = await client.query(
      "SELECT uuid, username FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      client.release();
      // Security: Return success even if user doesn't exist
      return { success: true, message: t("checkEmail") || "Check email for reset link" };
    }

    const userId = result.rows[0].uuid;

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    // Store reset token in database
    await client.query(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET token_hash = $2, expires_at = $3",
      [userId, resetTokenHash, expiresAt]
    );

    client.release();

    // TODO: Send email with reset link
    // Email should include: resetLink = `/reset-password?token=${resetToken}`
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return { success: true, message: t("checkEmail") || "Check email for reset link" };
  } catch (error: any) {
    console.error("Error in forgot password:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to process request");
  }
}
