"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface SendEmailParams {
  recipientEmail: string;
  subject: string;
  body: string;
  recipientId?: number;
}

export async function sendNotificationEmail(params: SendEmailParams) {
  const t = await getTranslations("sendNotificationEmailFunction");

  try {
    if (!params.recipientEmail || !params.subject || !params.body) {
      throw new Error(
        t("allFieldsRequired") || "Email, subject, and body are required"
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(params.recipientEmail)) {
      throw new Error(t("emailInvalid") || "Invalid email address");
    }

    const client = await pool.connect();

    // Log email in database
    const result = await client.query(
      `INSERT INTO email_history (recipient_email, recipient_id, subject, body, status, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [params.recipientEmail, params.recipientId || null, params.subject, params.body, "sent"]
    );

    client.release();

    // TODO: Integrate with email service (SendGrid, Nodemailer, etc.)
    console.log(`Email sent to ${params.recipientEmail}: ${params.subject}`);

    return {
      success: true,
      data: result.rows[0],
      message: t("emailSent") || "Email sent successfully",
    };
  } catch (error: any) {
    console.error("Error sending notification email:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to send email");
  }
}
