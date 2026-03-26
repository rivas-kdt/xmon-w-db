"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface GenerateInventoryReportParams {
  startDate?: string;
  endDate?: string;
}

export async function generateInventoryReport(params?: GenerateInventoryReportParams) {
  const t = await getTranslations("generateInventoryReportFunction");

  try {
    const client = await pool.connect();

    let query = `SELECT i.*, p.stock_no, p.description, w.warehouse
                 FROM inventory i
                 JOIN parts p ON i.lot_no = p.lot_no
                 LEFT JOIN parts_location pl ON p.lot_no = pl.lot_no
                 LEFT JOIN warehouse w ON pl.warehouse_id = w.id
                 WHERE 1=1`;

    const values: any[] = [];
    let paramIndex = 1;

    if (params?.startDate && params?.endDate) {
      query += ` AND i.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      values.push(params.startDate, params.endDate);
      paramIndex += 2;
    }

    query += ` ORDER BY p.stock_no ASC`;

    const result = await client.query(query, values);
    client.release();

    // Calculate summary
    const totalItems = result.rows.length;
    const totalQuantity = result.rows.reduce(
      (sum, row) => sum + (row.quantity_on_hand || 0),
      0
    );
    const lowStockItems = result.rows.filter((row) => row.quantity_on_hand <= 10).length;

    return {
      items: result.rows,
      summary: {
        totalItems,
        totalQuantity,
        lowStockItems,
        averageQuantity: totalItems > 0 ? totalQuantity / totalItems : 0,
      },
    };
  } catch (error: any) {
    console.error("Error generating inventory report:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to generate report");
  }
}
