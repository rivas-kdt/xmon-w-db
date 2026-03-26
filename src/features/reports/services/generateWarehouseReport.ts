"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function generateWarehouseReport() {
  const t = await getTranslations("generateWarehouseReportFunction");

  try {
    const client = await pool.connect();

    const warehouseStats = await client.query(
      `SELECT w.id, w.warehouse, w.location,
              COUNT(DISTINCT pl.lot_no) as total_items,
              SUM(i.quantity_on_hand) as total_quantity,
              COUNT(DISTINCT wl.user_id) as worker_count
       FROM warehouse w
       LEFT JOIN parts_location pl ON w.id = pl.warehouse_id
       LEFT JOIN inventory i ON pl.lot_no = i.lot_no
       LEFT JOIN worker_location wl ON w.id = wl.warehouse_id
       GROUP BY w.id, w.warehouse, w.location
       ORDER BY w.warehouse ASC`
    );

    client.release();

    return {
      warehouses: warehouseStats.rows,
      summary: {
        totalWarehouses: warehouseStats.rows.length,
        totalItems: warehouseStats.rows.reduce((sum, row) => sum + (row.total_items || 0), 0),
        totalQuantity: warehouseStats.rows.reduce(
          (sum, row) => sum + (row.total_quantity || 0),
          0
        ),
      },
    };
  } catch (error: any) {
    console.error("Error generating warehouse report:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to generate report");
  }
}
