"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function getStockAnalytics() {
  const t = await getTranslations("getStockAnalyticsFunction");

  try {
    const client = await pool.connect();

    // Total stock entries
    const totalEntries = await client.query(
      "SELECT COUNT(*) as count FROM stock_history"
    );

    // Stock added today
    const addedToday = await client.query(
      `SELECT COUNT(*) as count FROM stock_history
       WHERE DATE(created_at) = CURRENT_DATE AND action = 'in'`
    );

    // Stock removed today
    const removedToday = await client.query(
      `SELECT COUNT(*) as count FROM stock_history
       WHERE DATE(created_at) = CURRENT_DATE AND action = 'out'`
    );

    // Net change today
    const netQuantityToday = await client.query(
      `SELECT
         COALESCE(SUM(CASE WHEN action = 'in' THEN quantity ELSE -quantity END), 0) as total
       FROM stock_history
       WHERE DATE(created_at) = CURRENT_DATE`
    );

    // Top warehouses by activity
    const topWarehouses = await client.query(
      `SELECT w.warehouse, COUNT(sh.id) as activity_count, SUM(sh.quantity) as total_qty
       FROM stock_history sh
       LEFT JOIN warehouse w ON sh.warehouse_id = w.id
       GROUP BY w.id, w.warehouse
       ORDER BY activity_count DESC
       LIMIT 5`
    );

    client.release();

    return {
      totalEntries: parseInt(totalEntries.rows[0].count),
      addedToday: parseInt(addedToday.rows[0].count),
      removedToday: parseInt(removedToday.rows[0].count),
      netQuantityToday: parseInt(netQuantityToday.rows[0].total),
      topWarehouses: topWarehouses.rows,
    };
  } catch (error: any) {
    console.error("Error fetching stock analytics:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch analytics");
  }
}
