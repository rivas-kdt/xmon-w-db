"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function deleteWarehouse(warehouseId: string) {
  const t = await getTranslations("deleteWarehouseFunction");

  try {
    if (!warehouseId) {
      throw new Error(t("warehouseIdRequired") || "Warehouse ID is required");
    }

    const client = await pool.connect();

    // Check if warehouse exists
    const warehouseCheck = await client.query(
      "SELECT id, warehouse FROM warehouse WHERE id = $1",
      [warehouseId]
    );
    if (warehouseCheck.rows.length === 0) {
      client.release();
      throw new Error(t("warehouseNotFound") || "Warehouse not found");
    }

    const warehouseName = warehouseCheck.rows[0].warehouse;

    // Check if warehouse has associated data
    const partsCheck = await client.query(
      "SELECT COUNT(*) as count FROM parts_location WHERE warehouse_id = $1",
      [warehouseId]
    );

    if (parseInt(partsCheck.rows[0].count) > 0) {
      client.release();
      throw new Error(t("warehouseHasData") || "Cannot delete warehouse with associated data");
    }

    // Delete warehouse
    await client.query("DELETE FROM warehouse WHERE id = $1", [warehouseId]);

    client.release();

    return {
      success: true,
      message: t("warehouseDeleted") || `${warehouseName} deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting warehouse:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to delete warehouse");
  }
}
