"use server";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";

export async function addRecipient(email: string) {
  const t = await getTranslations("addRecipient");
  try {
    const client = await pool.connect();
    if (!email) {
      const errorMessage = t("errorRequired");
      throw new Error(errorMessage);
    }
    const result = await client.query(
      `INSERT INTO recipients (email) VALUES ($1) RETURNING *`,
      [email]
    );
    client.release();
    return result.rows[0];
  } catch (error: any) {
    const fallbackError = t("fallbackError");
    throw new Error(error.message || fallbackError);
  }
}
