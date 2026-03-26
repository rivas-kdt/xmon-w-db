"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface UpdateInventoryParams {
  description?: string;
  quantity_on_hand?: number;
  reorder_level?: number;
}

export async function updateInventoryItem(
  lotNo: string,
  updates: UpdateInventoryParams
) {
  const t = await getTranslations("updateInventoryItemFunction");

  try {
    if (!lotNo) {
      throw new Error(t("lotNoRequired") || "Lot number is required");
    }

    if (Object.keys(updates).length === 0) {
      throw new Error(t("noUpdatesProvided") || "No updates provided");
    }

    const client = await pool.connect();

    // Check if item exists
    const itemCheck = await client.query(
      "SELECT lot_no FROM inventory WHERE lot_no = $1",
      [lotNo]
    );
    if (itemCheck.rows.length === 0) {
      client.release();
      throw new Error(t("itemNotFound") || "Inventory item not found");
    }

    const updateFields = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (updates.quantity_on_hand !== undefined) {
      if (updates.quantity_on_hand < 0) {
        client.release();
        throw new Error(t("quantityCannotBeNegative") || "Quantity cannot be negative");
      }
      updateFields.push(`quantity_on_hand = $${paramIndex}`);
      updateValues.push(updates.quantity_on_hand);
      paramIndex++;
    }

    if (updates.reorder_level !== undefined) {
      updateFields.push(`reorder_level = $${paramIndex}`);
      updateValues.push(updates.reorder_level);
      paramIndex++;
    }

    if (updates.description !== undefined) {
      updateFields.push(`description = $${paramIndex}`);
      updateValues.push(updates.description);
      paramIndex++;
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(lotNo);

    const result = await client.query(
      `UPDATE inventory SET ${updateFields.join(", ")} WHERE lot_no = $${paramIndex} RETURNING *`,
      updateValues
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error updating inventory item:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to update inventory item");
  }
}
