"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function getStockByWarehouse(warehouseId: string) {
  const t = await getTranslations("getStockByWarehouseFunction");

  try {
    if (!warehouseId) {
      throw new Error(t("warehouseIdRequired") || "Warehouse ID is required");
    }

    const client = await pool.connect();

    const result = await client.query(
      `SELECT i.*, p.stock_no, p.description, p.lot_no, w.warehouse
       FROM inventory i
       JOIN parts p ON i.lot_no = p.lot_no
       JOIN parts_location pl ON p.lot_no = pl.lot_no
       JOIN warehouse w ON pl.warehouse_id = w.id
       WHERE w.id = $1
       ORDER BY p.stock_no ASC`,
      [warehouseId]
    );

    client.release();

    return result.rows;
  } catch (error: any) {
    console.error("Error fetching stock by warehouse:", error);
    throw new Error(
      error.message || t("fallbackError") || "Failed to fetch warehouse stock"
    );
  }
}
