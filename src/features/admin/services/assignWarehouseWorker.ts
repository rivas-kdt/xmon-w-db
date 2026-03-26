"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function assignWarehouseWorker(userId: string, warehouseId: string) {
  const t = await getTranslations("assignWarehouseWorkerFunction");

  try {
    if (!userId || !warehouseId) {
      throw new Error(
        t("userIdAndWarehouseIdRequired") || "User ID and Warehouse ID are required"
      );
    }

    const client = await pool.connect();

    // Check if user exists
    const userCheck = await client.query("SELECT id FROM users WHERE uuid = $1", [userId]);
    if (userCheck.rows.length === 0) {
      client.release();
      throw new Error(t("userNotFound") || "User not found");
    }

    // Check if warehouse exists
    const warehouseCheck = await client.query("SELECT id FROM warehouse WHERE id = $1", [
      warehouseId,
    ]);
    if (warehouseCheck.rows.length === 0) {
      client.release();
      throw new Error(t("warehouseNotFound") || "Warehouse not found");
    }

    // Check if assignment already exists
    const existingCheck = await client.query(
      "SELECT id FROM worker_location WHERE user_id = $1 AND warehouse_id = $2",
      [userCheck.rows[0].id, warehouseId]
    );

    if (existingCheck.rows.length > 0) {
      client.release();
      throw new Error(t("alreadyAssigned") || "Worker is already assigned to this warehouse");
    }

    // Create assignment
    const result = await client.query(
      "INSERT INTO worker_location (user_id, warehouse_id, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [userCheck.rows[0].id, warehouseId]
    );

    client.release();

    return {
      success: true,
      data: result.rows[0],
      message: t("workerAssigned") || "Worker assigned successfully",
    };
  } catch (error: any) {
    console.error("Error assigning warehouse worker:", error);
    throw new Error(error.message || t("fallbackError") || "Failed to assign worker");
  }
}
