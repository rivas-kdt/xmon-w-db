"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function addWarehouse(warehouseName: string, location: string) {
  const t = await getTranslations("addWarehouse");

  try {
    const client = await pool.connect();

    if (!warehouseName || !location) {
      const errorMessage = t("errorRequired");
      throw new Error(errorMessage);
    }
    const existingWarehouse = await client.query(
      `SELECT * FROM warehouse WHERE warehouse = $1`,
      [warehouseName]
    );
    if (existingWarehouse.rows.length > 0) {
      const errorMessage = t("errorExists");
      throw new Error(errorMessage);
    }
    const result = await client.query(
      `INSERT INTO warehouse (warehouse, location) VALUES ($1, $2) RETURNING *`,
      [warehouseName, location]
    );

    client.release();
    return result.rows[0];
  } catch (error: any) {
    const fallbackError = t("fallbackError");
    throw new Error(error.message || fallbackError);
  }
}
