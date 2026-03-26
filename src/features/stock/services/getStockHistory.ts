"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export async function getStockHistory(params?: DateRange) {
  const t = await getTranslations("getStockHistoryFunction");

  try {
    const client = await pool.connect();

    let query = `SELECT sh.*, p.stock_no, p.description, p.lot_no, w.warehouse
                 FROM stock_history sh
                 JOIN parts p ON sh.lot_no = p.lot_no
                 LEFT JOIN warehouse w ON sh.warehouse_id = w.id`;

    const values: any[] = [];
    let paramIndex = 1;

    if (params?.startDate && params?.endDate) {
      query += ` WHERE sh.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      values.push(params.startDate, params.endDate);
      paramIndex += 2;
    }

    query += ` ORDER BY sh.created_at DESC`;

    const result = await client.query(query, values);
    client.release();

    return result.rows;
  } catch (error: any) {
    console.error("Error fetching stock history:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch stock history");
  }
}
