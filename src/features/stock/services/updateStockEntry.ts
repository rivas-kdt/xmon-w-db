"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface UpdateStockParams {
  quantity?: number;
  notes?: string;
}

export async function updateStockEntry(historyId: string, updates: UpdateStockParams) {
  const t = await getTranslations("updateStockEntryFunction");

  try {
    if (!historyId) {
      throw new Error(t("historyIdRequired") || "Stock entry ID is required");
    }

    if (Object.keys(updates).length === 0) {
      throw new Error(t("noUpdatesProvided") || "No updates provided");
    }

    const client = await pool.connect();

    // Check if entry exists
    const entryCheck = await client.query("SELECT id FROM stock_history WHERE id = $1", [
      historyId,
    ]);
    if (entryCheck.rows.length === 0) {
      client.release();
      throw new Error(t("entryNotFound") || "Stock entry not found");
    }

    const updateFields = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (updates.quantity !== undefined) {
      if (updates.quantity < 0) {
        client.release();
        throw new Error(t("quantityCannotBeNegative") || "Quantity cannot be negative");
      }
      updateFields.push(`quantity = $${paramIndex}`);
      updateValues.push(updates.quantity);
      paramIndex++;
    }

    if (updates.notes !== undefined) {
      updateFields.push(`notes = $${paramIndex}`);
      updateValues.push(updates.notes);
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(historyId);

    const result = await client.query(
      `UPDATE stock_history SET ${updateFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      updateValues
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error updating stock entry:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to update stock entry");
  }
}
