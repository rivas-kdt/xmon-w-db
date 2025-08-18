import { encrypt } from "@/lib/cookieHandler";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }
  if (!password) {
    return NextResponse.json(
      { error: "Password is required" },
      { status: 400 }
    );
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM users u LEFT JOIN worker_location wl ON u.id = wl.user_id LEFT JOIN warehouse w ON wl.warehouse_id=w.id WHERE username = $1",
      [username]
    );
    client.release();
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isValidPassword = await bcrypt.compare(
      password,
      result.rows[0].password_hash
    );
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const user = {
      userId: result.rows[0].uuid,
      email: result.rows[0].email,
      role: result.rows[0].role,
      location: result.rows[0].location,
      username: result.rows[0].username,
    };
    // const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    const token = await encrypt({ user });
    return NextResponse.json(
      { message: "Login successful", user, token: token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * from users");
    client.release();
    return new Response(JSON.stringify(result.rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Database query failed" }), {
      status: 500,
    });
  }
}
