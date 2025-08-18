import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { useTranslations } from "next-intl";

export async function POST(request: Request) {
  const { username, email, role, password } = await request.json();
  const t = useTranslations("addUser");

  if (!username) {
    return new Response(JSON.stringify({ error: "Username required" }), {
      status: 400,
    });
  }
  if (!email) {
    return new Response(JSON.stringify({ error: "Email required" }), {
      status: 400,
    });
  }
  if (!role) {
    return new Response(JSON.stringify({ error: "Role required" }), {
      status: 400,
    });
  }
  if (!password) {
    return new Response(JSON.stringify({ error: "Password required" }), {
      status: 400,
    });
  }

  try {
    const client = await pool.connect();
    const passwordHash = await bcrypt.hash(password, 10);
    const result = await client.query(
      "INSERT INTO users (username, email, role, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, role, passwordHash]
    );
    client.release();
    if (result.rows.length > 0) {
      return new Response(JSON.stringify(result.rows[0]), {
        status: 201,
      });
    } else {
      return new Response(JSON.stringify({ error: "User creation failed" }), {
        status: 400,
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Signup failed" }), {
      status: 500,
    });
  }
}
