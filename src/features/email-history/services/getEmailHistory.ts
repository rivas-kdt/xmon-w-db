"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface GetEmailHistoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function getEmailHistory(params: GetEmailHistoryParams = {}) {
  const t = await getTranslations("getEmailHistoryFunction");

  const page = Math.max(1, Number(params.page || 1));
  const limit = Math.max(1, Number(params.limit || 10));
  const offset = (page - 1) * limit;
  const search = (params.search || "").trim().toLowerCase();

  try {
    const client = await pool.connect();

    const values: any[] = [];
    const where: string[] = [];

    if (search) {
      values.push(`%${search}%`);
      const searchIndex = values.length;

      where.push(`
        (
          LOWER(eh.id::text) LIKE $${searchIndex}
          OR LOWER(TO_CHAR(eh.created_at, 'YYYY-MM-DD')) LIKE $${searchIndex}
          OR EXISTS (
            SELECT 1
            FROM email_transaction et2
            JOIN transaction_history th2 ON th2.id = et2.transaction_id
            JOIN parts p2 ON p2.lot_no = th2.lot_no
            WHERE et2.email_id = eh.id
              AND (
                LOWER(th2.lot_no::text) LIKE $${searchIndex}
                OR LOWER(p2.stock_no::text) LIKE $${searchIndex}
                OR LOWER(COALESCE(p2.description, '')) LIKE $${searchIndex}
                OR LOWER(COALESCE(p2.product_code, '')) LIKE $${searchIndex}
                OR LOWER(COALESCE(th2.status, '')) LIKE $${searchIndex}
                OR LOWER(th2.quantity::text) LIKE $${searchIndex}
              )
          )
        )
      `);
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const countQuery = `
      SELECT COUNT(*)::int AS total
      FROM email_history eh
      ${whereSQL};
    `;

    const countResult = await client.query(countQuery, values);
    const total = countResult.rows[0]?.total ?? 0;

    values.push(limit, offset);

    const dataQuery = `
      SELECT
        eh.id as email_id,
        eh.created_at AS date,
        json_agg(
          json_build_object(
            'lot_no', th.lot_no,
            'stock_no', p.stock_no,
            'description', p.description,
            'product_code', p.product_code,
            'status', th.status,
            'quantity', th.quantity
          )
          ORDER BY th.id
        ) AS email_transaction
      FROM email_history eh
      JOIN email_transaction et ON eh.id = et.email_id
      JOIN transaction_history th ON th.id = et.transaction_id
      JOIN parts p ON p.lot_no = th.lot_no
      ${whereSQL}
      GROUP BY eh.id, eh.created_at
      ORDER BY eh.created_at DESC
      LIMIT $${values.length - 1}
      OFFSET $${values.length};
    `;

    const result = await client.query(dataQuery, values);

    client.release();

    return {
      rows: result.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error: any) {
    console.error("Error fetching email history:", error);
    throw new Error(
      error.message || t("fallbackError") || "Failed to fetch email history"
    );
  }
}
