"use server";
import pool from "@/lib/db";

export async function getTotalInventory() {
  try {
    const client = await pool.connect();
    const result = await client.query(`WITH
  total_shipped AS (
    SELECT COALESCE(SUM(quantity), 0) AS value
    FROM transaction_history
    WHERE status = 'shipped'
  ),
  total_stocked AS (
    SELECT COALESCE(SUM(quantity), 0) AS value
    FROM transaction_history
    WHERE status = 'stocked'
  )
SELECT
  total_stocked.value AS total_stocked,
  total_shipped.value AS total_shipped,
  total_stocked.value - total_shipped.value AS net_quantity
FROM total_stocked, total_shipped;`);
    client.release();
    return result.rows[0];
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}
