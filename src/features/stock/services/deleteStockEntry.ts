"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function deleteStockEntry(historyId: string) {
  const t = await getTranslations("deleteStockEntryFunction");

  try {
    if (!historyId) {
      throw new Error(t("historyIdRequired") || "Stock entry ID is required");
    }

    const client = await pool.connect();

    // Check if entry exists
    const entryCheck = await client.query("SELECT id FROM stock_history WHERE id = $1", [
      historyId,
    ]);
    if (entryCheck.rows.length === 0) {
      client.release();
      throw new Error(t("entryNotFound") || "Stock entry not found");
    }

    // Delete entry
    await client.query("DELETE FROM stock_history WHERE id = $1", [historyId]);

    client.release();

    return {
      success: true,
      message: t("entryDeleted") || "Stock entry deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting stock entry:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to delete stock entry");
  }
}
