"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

interface PaginationParams {
  page: number;
  limit: number;
}

export async function getShipments(params?: PaginationParams) {
  const t = await getTranslations("getShipmentsFunction");
  const page = params?.page || 1;
  const limit = params?.limit || 10;
  const offset = (page - 1) * limit;

  try {
    const client = await pool.connect();

    // Get total count
    const countResult = await client.query("SELECT COUNT(*) as total FROM shipment_history");
    const total = parseInt(countResult.rows[0].total);

    // Get paginated shipments
    const result = await client.query(
      `SELECT id, lot_no, quantity, status, created_at, updated_at, recipient_id, warehouse_id
       FROM shipment_history
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    client.release();

    return {
      shipments: result.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error: any) {
    console.error("Error fetching shipments:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch shipments");
  }
}
