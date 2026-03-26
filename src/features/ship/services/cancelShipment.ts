"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function cancelShipment(shipmentId: string, reason?: string) {
  const t = await getTranslations("cancelShipmentFunction");

  try {
    if (!shipmentId) {
      throw new Error(t("shipmentIdRequired") || "Shipment ID is required");
    }

    const client = await pool.connect();

    // Check if shipment exists and is cancellable
    const shipmentCheck = await client.query(
      "SELECT id, status FROM shipment_history WHERE id = $1",
      [shipmentId]
    );
    if (shipmentCheck.rows.length === 0) {
      client.release();
      throw new Error(t("shipmentNotFound") || "Shipment not found");
    }

    const currentStatus = shipmentCheck.rows[0].status;
    if (currentStatus === "delivered" || currentStatus === "cancelled") {
      client.release();
      throw new Error(t("cannotCancelShipment") || "This shipment cannot be cancelled");
    }

    const result = await client.query(
      `UPDATE shipment_history
       SET status = 'cancelled',
           cancellation_reason = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [reason || null, shipmentId]
    );

    client.release();

    return {
      success: true,
      data: result.rows[0],
      message: t("shipmentCancelled") || "Shipment cancelled successfully",
    };
  } catch (error: any) {
    console.error("Error cancelling shipment:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to cancel shipment");
  }
}
