"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface GenerateSalesReportParams {
  startDate?: string;
  endDate?: string;
}

export async function generateSalesReport(params?: GenerateSalesReportParams) {
  const t = await getTranslations("generateSalesReportFunction");

  try {
    const client = await pool.connect();

    let query = `SELECT sh.*, p.stock_no, p.description, w.warehouse, r.name as recipient_name
                 FROM shipment_history sh
                 JOIN parts p ON sh.lot_no = p.lot_no
                 LEFT JOIN warehouse w ON sh.warehouse_id = w.id
                 LEFT JOIN recipients r ON sh.recipient_id = r.id
                 WHERE sh.status = 'delivered'`;

    const values: any[] = [];
    let paramIndex = 1;

    if (params?.startDate && params?.endDate) {
      query += ` AND sh.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      values.push(params.startDate, params.endDate);
      paramIndex += 2;
    }

    query += ` ORDER BY sh.created_at DESC`;

    const result = await client.query(query, values);
    client.release();

    const totalShipments = result.rows.length;
    const totalQuantity = result.rows.reduce((sum, row) => sum + (row.quantity || 0), 0);

    return {
      shipments: result.rows,
      summary: {
        totalShipments,
        totalQuantity,
        averageQuantity: totalShipments > 0 ? totalQuantity / totalShipments : 0,
      },
    };
  } catch (error: any) {
    console.error("Error generating sales report:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to generate report");
  }
}
