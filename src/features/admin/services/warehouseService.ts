"use server";
import pool from "@/lib/db";

export async function getWarehouse() {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `SELECT warehouse, location FROM warehouse`
    );
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}

export async function getWarehouseWorkers() {
  try {
    const client = await pool.connect();
    const result =
      await client.query(`SELECT w.id, w.warehouse, w.location, COUNT(wl.user_id) AS workers, w.created_at
        FROM warehouse w JOIN worker_location wl ON w.id=wl.warehouse_id GROUP BY w.id`);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}

export async function addWarehouse(warehouseName: string, location: string) {
  try {
    const client = await pool.connect();
    const result = await client.query(
      `INSERT INTO warehouse (warehouse, location) VALUES ($1, $2) RETURNING *`,
      [warehouseName, location]
    );
    client.release();
    return result.rows[0];
  } catch (error: any) {
    console.error("Error adding warehouse:", error);
    throw new Error(error.message || "Failed to add warehouse");
  }
}
