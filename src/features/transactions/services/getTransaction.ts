"use server";
import pool from "@/lib/db";

export async function getTransaction() {
  try {
    const client = await pool.connect();
    const result =
      await client.query(`SELECT t.lot_no, p.stock_no, p.description, t.created_at, w.warehouse, t.quantity, t.status, ti."imgUrl"
        FROM transaction_history t
        JOIN parts p ON p.lot_no=t.lot_no
        JOIN parts_location pl ON pl.lot_no=p.lot_no
        JOIN warehouse w ON w.id=pl.warehouse_id
        JOIN inventory i ON i.lot_no=p.lot_no
        JOIN transaction_image ti ON ti.id=t.id
        ORDER BY created_at DESC`);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}
