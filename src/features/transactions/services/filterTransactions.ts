"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface FilterParams {
  startDate?: string;
  endDate?: string;
  type?: string;
  warehouseId?: string;
}

export async function filterTransactions(filters: FilterParams) {
  const t = await getTranslations("filterTransactionsFunction");

  try {
    const client = await pool.connect();

    let query = `SELECT t.*, p.stock_no, p.description, w.warehouse
                 FROM transaction_history t
                 JOIN parts p ON t.lot_no = p.lot_no
                 LEFT JOIN warehouse w ON t.warehouse_id = w.id
                 WHERE 1=1`;

    const values: any[] = [];
    let paramIndex = 1;

    if (filters.startDate && filters.endDate) {
      query += ` AND t.created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      values.push(filters.startDate, filters.endDate);
      paramIndex += 2;
    }

    if (filters.type) {
      query += ` AND t.status = $${paramIndex}`;
      values.push(filters.type);
      paramIndex++;
    }

    if (filters.warehouseId) {
      query += ` AND t.warehouse_id = $${paramIndex}`;
      values.push(filters.warehouseId);
      paramIndex++;
    }

    query += ` ORDER BY t.created_at DESC`;

    const result = await client.query(query, values);
    client.release();

    return result.rows;
  } catch (error: any) {
    console.error("Error filtering transactions:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to filter transactions");
  }
}
