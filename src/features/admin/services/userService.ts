"use server"
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

export async function getUsers() {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT u.id, u.username, u.email, u.role, u.created_at, w.warehouse, w.location
        FROM users u JOIN worker_location wl ON u.id=wl.user_id
        JOIN warehouse w ON w.id=wl.warehouse_id`);
    client.release();
    return result.rows;
  } catch (error: any) {
    console.error("Error fetching ship data:", error);
    throw new Error(error.message || "Failed to fetch ship data");
  }
}

export async function addUser(username: string, email: string, password: string, role: string, warehouseId: number) {
  try {
    const client = await pool.connect();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await client.query(
      `INSERT INTO users (username, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, hashedPassword, role]
    );
    const userId = result.rows[0].id;

    // Associate user with warehouse
    await client.query(
      `INSERT INTO worker_location (user_id, warehouse_id) VALUES ($1, $2)`,
      [userId, warehouseId]
    );

    client.release();
    return result.rows[0];
  } catch (error: any) {
    console.error("Error adding user:", error);
    throw new Error(error.message || "Failed to add user");
  }
}