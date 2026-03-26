"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function deleteRecipient(recipientId: string) {
  const t = await getTranslations("deleteRecipientFunction");

  try {
    if (!recipientId) {
      throw new Error(t("recipientIdRequired") || "Recipient ID is required");
    }

    const client = await pool.connect();

    // Check if recipient exists
    const recipientCheck = await client.query(
      "SELECT id, name FROM recipients WHERE id = $1",
      [recipientId]
    );
    if (recipientCheck.rows.length === 0) {
      client.release();
      throw new Error(t("recipientNotFound") || "Recipient not found");
    }

    const recipientName = recipientCheck.rows[0].name;

    // Delete recipient
    await client.query("DELETE FROM recipients WHERE id = $1", [recipientId]);

    client.release();

    return {
      success: true,
      message: t("recipientDeleted") || `${recipientName} deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting recipient:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to delete recipient");
  }
}
