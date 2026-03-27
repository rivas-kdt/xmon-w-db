"use server";

import pool from "@/lib/db";

export async function getWarehouses() {
  const client = await pool.connect();

  try {
    const res = await client.query(
      `SELECT id, warehouse, location
       FROM warehouse
       ORDER BY warehouse ASC`
    );

    return res.rows;
  } catch (error) {
    console.error("Error fetching warehouses:", error);
    throw new Error("Failed to fetch warehouses");
  } finally {
    client.release();
  }
}
