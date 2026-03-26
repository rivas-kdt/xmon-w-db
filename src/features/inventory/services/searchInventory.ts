"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function searchInventory(searchTerm: string) {
  const t = await getTranslations("searchInventoryFunction");

  try {
    if (!searchTerm || searchTerm.length < 2) {
      throw new Error(t("searchTermTooShort") || "Search term must be at least 2 characters");
    }

    const client = await pool.connect();

    const result = await client.query(
      `SELECT i.*, p.stock_no, p.description, p.lot_no, pl.warehouse_id
       FROM inventory i
       JOIN parts p ON i.lot_no = p.lot_no
       LEFT JOIN parts_location pl ON p.lot_no = pl.lot_no
       WHERE p.stock_no ILIKE $1 OR p.description ILIKE $1 OR p.lot_no ILIKE $1
       ORDER BY p.stock_no ASC`,
      [`%${searchTerm}%`]
    );

    client.release();

    return result.rows;
  } catch (error: any) {
    console.error("Error searching inventory:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to search inventory");
  }
}
