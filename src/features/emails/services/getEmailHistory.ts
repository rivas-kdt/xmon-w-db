"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export async function getEmailHistory(params?: DateRange) {
  const t = await getTranslations("getEmailHistoryFunction");

  try {
    const client = await pool.connect();

    let query = `SELECT * FROM email_history WHERE 1=1`;
    const values: any[] = [];
    let paramIndex = 1;

    if (params?.startDate && params?.endDate) {
      query += ` AND created_at BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
      values.push(params.startDate, params.endDate);
      paramIndex += 2;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await client.query(query, values);
    client.release();

    return result.rows;
  } catch (error: any) {
    console.error("Error fetching email history:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch email history");
  }
}
