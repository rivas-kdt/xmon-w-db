"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function getShipmentDetails(shipmentId: string) {
  const t = await getTranslations("getShipmentDetailsFunction");

  try {
    if (!shipmentId) {
      throw new Error(t("shipmentIdRequired") || "Shipment ID is required");
    }

    const client = await pool.connect();

    const result = await client.query(
      `SELECT sh.*, p.stock_no, p.description, w.warehouse, r.name as recipient_name, r.email
       FROM shipment_history sh
       JOIN parts p ON sh.lot_no = p.lot_no
       LEFT JOIN warehouse w ON sh.warehouse_id = w.id
       LEFT JOIN recipients r ON sh.recipient_id = r.id
       WHERE sh.id = $1`,
      [shipmentId]
    );

    client.release();

    if (result.rows.length === 0) {
      throw new Error(t("shipmentNotFound") || "Shipment not found");
    }

    return result.rows[0];
  } catch (error: any) {
    console.error("Error fetching shipment details:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to fetch shipment details");
  }
}
