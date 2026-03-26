"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function updateShipmentStatus(shipmentId: string, newStatus: string) {
  const t = await getTranslations("updateShipmentStatusFunction");

  try {
    if (!shipmentId || !newStatus) {
      throw new Error(t("shipmentIdAndStatusRequired") || "Shipment ID and status are required");
    }

    const validStatuses = ["pending", "in_transit", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      throw new Error(t("invalidStatus") || "Invalid shipment status");
    }

    const client = await pool.connect();

    // Check if shipment exists
    const shipmentCheck = await client.query(
      "SELECT id, status FROM shipment_history WHERE id = $1",
      [shipmentId]
    );
    if (shipmentCheck.rows.length === 0) {
      client.release();
      throw new Error(t("shipmentNotFound") || "Shipment not found");
    }

    const result = await client.query(
      "UPDATE shipment_history SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      [newStatus.toLowerCase(), shipmentId]
    );

    client.release();

    return result.rows[0];
  } catch (error: any) {
    console.error("Error updating shipment status:", error);
    throw new Error(
      error.message || t("fallbackError") || "Failed to update shipment status"
    );
  }
}
