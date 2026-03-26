"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function getLowStockItems(threshold: number = 10) {
  const t = await getTranslations("getLowStockItemsFunction");

  try {
    if (threshold < 0) {
      throw new Error(t("invalidThreshold") || "Threshold must be a positive number");
    }

    const client = await pool.connect();

    const result = await client.query(
      `SELECT i.*, p.stock_no, p.description, p.lot_no, w.warehouse
       FROM inventory i
       JOIN parts p ON i.lot_no = p.lot_no
       LEFT JOIN parts_location pl ON p.lot_no = pl.lot_no
       LEFT JOIN warehouse w ON pl.warehouse_id = w.id
       WHERE i.quantity_on_hand <= $1
       ORDER BY i.quantity_on_hand ASC`,
      [threshold]
    );

    client.release();

    return result.rows;
  } catch (error: any) {
    console.error("Error fetching low stock items:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch low stock items");
  }
}
