"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function deleteInventoryItem(lotNo: string) {
  const t = await getTranslations("deleteInventoryItemFunction");

  try {
    if (!lotNo) {
      throw new Error(t("lotNoRequired") || "Lot number is required");
    }

    const client = await pool.connect();

    // Check if item exists
    const itemCheck = await client.query(
      "SELECT lot_no FROM inventory WHERE lot_no = $1",
      [lotNo]
    );
    if (itemCheck.rows.length === 0) {
      client.release();
      throw new Error(t("itemNotFound") || "Inventory item not found");
    }

    // Delete from inventory
    await client.query("DELETE FROM inventory WHERE lot_no = $1", [lotNo]);

    client.release();

    return {
      success: true,
      message: t("itemDeleted") || `Item ${lotNo} deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting inventory item:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to delete inventory item");
  }
}
