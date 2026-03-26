"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function getInventoryAnalytics() {
  const t = await getTranslations("getInventoryAnalyticsFunction");

  try {
    const client = await pool.connect();

    // Total items
    const totalItems = await client.query("SELECT COUNT(*) as count FROM inventory");

    // Low stock items (threshold: 10)
    const lowStockItems = await client.query(
      "SELECT COUNT(*) as count FROM inventory WHERE quantity_on_hand <= 10"
    );

    // Total quantity on hand
    const totalQuantity = await client.query(
      "SELECT SUM(quantity_on_hand) as total FROM inventory"
    );

    // Average stock per item
    const avgStock = await client.query(
      "SELECT AVG(quantity_on_hand) as avg FROM inventory"
    );

    // Items by warehouse
    const byWarehouse = await client.query(
      `SELECT w.warehouse, COUNT(DISTINCT i.lot_no) as item_count, SUM(i.quantity_on_hand) as total_qty
       FROM inventory i
       JOIN parts p ON i.lot_no = p.lot_no
       LEFT JOIN parts_location pl ON p.lot_no = pl.lot_no
       LEFT JOIN warehouse w ON pl.warehouse_id = w.id
       GROUP BY w.warehouse`
    );

    client.release();

    return {
      totalItems: parseInt(totalItems.rows[0].count),
      lowStockItems: parseInt(lowStockItems.rows[0].count),
      totalQuantity: parseInt(totalQuantity.rows[0].total) || 0,
      averageStock: parseFloat(avgStock.rows[0].avg) || 0,
      byWarehouse: byWarehouse.rows,
    };
  } catch (error: any) {
    console.error("Error fetching inventory analytics:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch analytics");
  }
}
