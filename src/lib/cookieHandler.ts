"use server";
import { SignJWT } from "jose";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

interface JwtPayload {
  exp: number;
  iat: number;
  user: {
    userId: string;
    email: string;
    role: string;
    username: string;
  };
}

const secretKey = process.env.JWT_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);

export async function create(data: string) {
  const cookieStore = await cookies();
  cookieStore.set("jwt", data, { secure: true });
}

export async function get(data: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(data);
  return token?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
}

export async function encrypt(payload: any) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("3d")
      .sign(key);
  } catch (error) {
    console.error("Error signing JWT:", error);
  }
}

export async function decrypt(
  session: string | undefined = ""
): Promise<JwtPayload | null> {
  try {
    if (!session) {
      throw new Error("Session is undefined or empty");
    }
    const payload = jwtDecode<JwtPayload>(session);
    return payload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}
