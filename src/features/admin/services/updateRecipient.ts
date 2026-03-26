"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface UpdateRecipientParams {
  email?: string;
  name?: string;
}

export async function updateRecipient(recipientId: string, updates: UpdateRecipientParams) {
  const t = await getTranslations("updateRecipientFunction");

  try {
    if (!recipientId) {
      throw new Error(t("recipientIdRequired") || "Recipient ID is required");
    }

    const { email, name } = updates;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error(t("emailInvalid") || "Invalid email address");
    }

    const client = await pool.connect();

    // Check if recipient exists
    const recipientCheck = await client.query(
      "SELECT id FROM recipients WHERE id = $1",
      [recipientId]
    );
    if (recipientCheck.rows.length === 0) {
      client.release();
      throw new Error(t("recipientNotFound") || "Recipient not found");
    }

    const updateFields = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (email) {
      updateFields.push(`email = $${paramIndex}`);
      updateValues.push(email);
      paramIndex++;
    }

    if (name) {
      updateFields.push(`name = $${paramIndex}`);
      updateValues.push(name);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      client.release();
      throw new Error(t("noUpdatesProvided") || "No updates provided");
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(recipientId);

    const result = await client.query(
      `UPDATE recipients SET ${updateFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      updateValues
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error updating recipient:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to update recipient");
  }
}
