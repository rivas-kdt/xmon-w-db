"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface UpdateWarehouseParams {
  name?: string;
  location?: string;
}

export async function updateWarehouse(warehouseId: string, updates: UpdateWarehouseParams) {
  const t = await getTranslations("updateWarehouseFunction");

  try {
    if (!warehouseId) {
      throw new Error(t("warehouseIdRequired") || "Warehouse ID is required");
    }

    const { name, location } = updates;

    const client = await pool.connect();

    // Check if warehouse exists
    const warehouseCheck = await client.query("SELECT id FROM warehouse WHERE id = $1", [
      warehouseId,
    ]);
    if (warehouseCheck.rows.length === 0) {
      client.release();
      throw new Error(t("warehouseNotFound") || "Warehouse not found");
    }

    const updateFields = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (name) {
      updateFields.push(`warehouse = $${paramIndex}`);
      updateValues.push(name);
      paramIndex++;
    }

    if (location) {
      updateFields.push(`location = $${paramIndex}`);
      updateValues.push(location);
      paramIndex++;
    }

    if (updateFields.length === 0) {
      client.release();
      throw new Error(t("noUpdatesProvided") || "No updates provided");
    }

    updateFields.push(`updated_at = NOW()`);
    updateValues.push(warehouseId);

    const result = await client.query(
      `UPDATE warehouse SET ${updateFields.join(", ")} WHERE id = $${paramIndex} RETURNING *`,
      updateValues
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error updating warehouse:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to update warehouse");
  }
}
