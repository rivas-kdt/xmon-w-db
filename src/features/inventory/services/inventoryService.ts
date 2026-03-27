"use server";

import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function updateInventory(data: any) {
  const t = await getTranslations("inventoryService");
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Update inventory (quantity)
    await client.query(
      `UPDATE inventory
       SET quantity = $1
       WHERE lot_no = $2`,
      [data.quantity, data.lot_no]
    );

    // 2. Update parts
    await client.query(
      `UPDATE parts
       SET product_code = $1,
           stock_no = $2,
           description = $3,
           updated_at = NOW()
       WHERE lot_no = $4`,
      [data.product_code, data.stock_no, data.description, data.lot_no]
    );

    // 3. Update parts_location (warehouse)
    await client.query(
      `UPDATE parts_location
       SET warehouse_id = $1
       WHERE lot_no = $2`,
      [data.warehouse_id, data.lot_no]
    );

    await client.query("COMMIT");

    return { success: true };
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Update error:", error);
    throw new Error(
      error.message || t("updateError") || "Failed to update inventory"
    );
  } finally {
    client.release();
  }
}
