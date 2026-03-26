"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function getTransactionAnalytics() {
  const t = await getTranslations("getTransactionAnalyticsFunction");

  try {
    const client = await pool.connect();

    // Total transactions
    const totalTransactions = await client.query(
      "SELECT COUNT(*) as count FROM transaction_history"
    );

    // Transactions today
    const transactionsToday = await client.query(
      `SELECT COUNT(*) as count FROM transaction_history
       WHERE DATE(created_at) = CURRENT_DATE`
    );

    // Transactions this month
    const transactionsMonth = await client.query(
      `SELECT COUNT(*) as count FROM transaction_history
       WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`
    );

    // Average quantity per transaction
    const avgQuantity = await client.query(
      "SELECT AVG(quantity) as avg FROM transaction_history"
    );

    // Transaction breakdown by status
    const byStatus = await client.query(
      `SELECT status, COUNT(*) as count
       FROM transaction_history
       GROUP BY status`
    );

    // Top warehouses by transaction count
    const topWarehouses = await client.query(
      `SELECT w.warehouse, COUNT(t.id) as transaction_count
       FROM transaction_history t
       LEFT JOIN warehouse w ON t.warehouse_id = w.id
       GROUP BY w.id, w.warehouse
       ORDER BY transaction_count DESC
       LIMIT 5`
    );

    client.release();

    return {
      totalTransactions: parseInt(totalTransactions.rows[0].count),
      transactionsToday: parseInt(transactionsToday.rows[0].count),
      transactionsMonth: parseInt(transactionsMonth.rows[0].count),
      avgQuantity: parseFloat(avgQuantity.rows[0].avg) || 0,
      byStatus: byStatus.rows,
      topWarehouses: topWarehouses.rows,
    };
  } catch (error: any) {
    console.error("Error fetching transaction analytics:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch analytics");
  }
}
