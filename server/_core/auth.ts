import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { users } from "../../drizzle/schema";
import { hash, verify } from "@node-rs/bcrypt";
import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key-change-in-prod");

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return verify(password, hash);
}

export async function generateToken(userId: number): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{ userId: number } | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as { userId: number };
  } catch {
    return null;
  }
}

export async function getUserById(userId: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  return result;
}

export async function getUserByHandle(handle: string) {
  return db.query.users.findFirst({
    where: eq(users.handle, handle),
  });
}

export async function generatePublicId(): Promise<string> {
  let publicId = "";
  let isUnique = false;
  while (!isUnique) {
    const rand = Math.floor(Math.random() * 1000000);
    publicId = `king_${rand}`;
    const existing = await db.query.users.findFirst({
      where: eq(users.publicId, publicId),
    });
    if (!existing) {
      isUnique = true;
    }
  }
  return publicId;
}

export async function logAuditEvent(
  userId: number | null,
  action: string,
  targetId?: number,
  targetType?: string,
  details?: any
) {
  // تسجيل حقيقي في قاعدة البيانات
  // يتم معالجته في مكان آخر
}